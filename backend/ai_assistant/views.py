import os
import json
import requests
import google.generativeai as genai

from dotenv import load_dotenv

from django.conf import settings
from django.core.mail import send_mail
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User

from rest_framework import generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Profile, Task, Project, Feedback
from .serializers import ProfileSerializer

# Завантаження змінних середовища
load_dotenv()

# Налаштування API Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-pro")

TELEGRAM_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")

def send_telegram_message(text):
    url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
    data = {"chat_id": TELEGRAM_CHAT_ID, "text": text}
    try:
        requests.post(url, data=data)
    except Exception as e:
        print("Помилка при відправленні Telegram:", e)

# === AI ===
@csrf_exempt
def ai_help(request):
    if request.method == 'GET':
        return JsonResponse({"status": "ok"})

    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            task_text = data.get("task", "")
            if not task_text:
                return JsonResponse({"error": "Запит порожній"}, status=400)

            try:
                response = model.generate_content(task_text)
                if not response.text:
                    return JsonResponse({"error": "Порожня відповідь від AI"}, status=500)
                answer = response.text.strip()
            except Exception as e:
                if "quota" in str(e).lower():
                    return JsonResponse({"error": "Досягнуто ліміт запитів до AI. Спробуйте через хвилину."}, status=429)
                return JsonResponse({"error": f"Помилка AI: {str(e)}"}, status=500)

            if request.user.is_authenticated:
                Task.objects.create(user=request.user, title=task_text, ai_response=answer)

            return JsonResponse({"response": answer})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Метод не дозволений"}, status=405)

# === TASKS ===
@csrf_exempt
@require_http_methods(["GET"])
def get_tasks(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Неавторизований користувач"}, status=401)

    tasks = Task.objects.filter(user=request.user).order_by('-created_at')
    data = [
        {
            "id": task.id,
            "title": task.title,
            "ai_response": task.ai_response,
            "created_at": task.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }
        for task in tasks
    ]
    return JsonResponse(data, safe=False)

@csrf_exempt
@require_http_methods(["DELETE"])
def delete_task(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    if task.user == request.user:
        task.delete()
        return JsonResponse({'message': 'Задачу видалено'})
    return JsonResponse({"error": "Заборонено"}, status=403)

@csrf_exempt
@require_http_methods(["PATCH"])
def update_task(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    if task.user != request.user:
        return JsonResponse({"error": "Заборонено"}, status=403)

    data = json.loads(request.body)
    task.title = data.get('title', task.title)
    task.save()
    return JsonResponse({'message': 'Задачу оновлено'})

# === PROJECTS ===
@csrf_exempt
@require_http_methods(["POST"])
def create_project(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Неавторизований користувач"}, status=401)

    data = json.loads(request.body)
    title = data.get("title")
    status = data.get("status", "У процесі")
    category = data.get("category", "Інше")
    progress = data.get("progress", 0)
    deadline = data.get("deadline")

    if not title:
        return JsonResponse({"error": "Назва проєкту обов'язкова"}, status=400)

    try:
        project = Project.objects.create(
            user=request.user,
            title=title,
            status=status,
            category=category,
            progress=progress,
            deadline=deadline
        )
        message = f"🆕 Новий проєкт: *{title}*\nКатегорія: {category}\nСтатус: {status}\nПрогрес: {progress}%"
        if deadline:
            message += f"\n📅 Дедлайн: {deadline}"
        send_telegram_message(message)
        return JsonResponse({"message": "Проєкт створено", "id": project.id})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

# === AUTH ===
@csrf_exempt
@require_http_methods(["POST"])
def register(request):
    data = json.loads(request.body)
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return JsonResponse({"error": "Необхідно вказати логін і пароль"}, status=400)

    if User.objects.filter(username=username).exists():
        return JsonResponse({"error": "Користувач вже існує"}, status=400)

    user = User.objects.create(username=username, password=make_password(password))
    Profile.objects.create(user=user)
    login(request, user)
    return JsonResponse({"message": "Реєстрація успішна", "username": user.username})

@csrf_exempt
@require_http_methods(["POST"])
def submit_feedback(request):
    try:
        data = json.loads(request.body)
        name = data.get("name", "")
        message = data.get("message", "")

        if not name or not message:
            return JsonResponse({"error": "Ім'я та повідомлення обов'язкові"}, status=400)

        feedback = Feedback.objects.create(name=name, message=message)

        send_mail(
            subject=f"Нове звернення від {name}",
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.ADMIN_EMAIL],
            fail_silently=False,
        )

        return JsonResponse({"message": "Дякуємо за ваш відгук!"})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

# === PROFILE ===
@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    try:
        profile = request.user.profile
    except Profile.DoesNotExist:
        return Response({'error': 'Профіль не знайдено'}, status=404)

    if request.method == 'GET':
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser]

    def get(self, request):
        serializer = ProfileSerializer(request.user.profile)
        return Response(serializer.data)

    def put(self, request):
        profile = request.user.profile
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
            
        return Response({
            'status': 'error',
            'errors': serializer.errors
        }, status=400)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer

    @api_view(['GET'])
    @permission_classes([IsAuthenticated])
    def get_profile(request):
        user = request.user
        return Response({
            'name': user.first_name,
            'login': user.username,
        })