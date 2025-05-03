import os
import json
import requests
from dotenv import load_dotenv
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import make_password
from .models import Task, Project
import google.generativeai as genai

# Завантаження змінних середовища
load_dotenv()

# Налаштування Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-pro")

TELEGRAM_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")

def send_telegram_message(text):
    url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
    data = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": text
    }
    try:
        requests.post(url, data=data)
    except Exception as e:
        print("Помилка при відправленні Telegram:", e)


# 📌 Створення нового проєкту
@csrf_exempt
@require_http_methods(["POST"])
def create_project(request):
    data = json.loads(request.body)
    title = data.get("title")
    status = data.get("status", "У процесі")
    category = data.get("category", "Інше")
    progress = data.get("progress", 0)
    deadline = data.get("deadline")  # ISO format: '2025-04-10T14:00:00'

    if not title:
        return JsonResponse({"error": "Назва проєкту обов'язкова"}, status=400)

    try:
        project = Project.objects.create(
            title=title,
            status=status,
            category=category,
            progress=progress,
            deadline=deadline
        )

        message = f"🆕 Новий проєкт створено: *{title}*\nКатегорія: {category}\nСтатус: {status}\nПрогрес: {progress}%"
        if deadline:
            message += f"\n📅 Дедлайн: {deadline}"
        send_telegram_message(message)

        return JsonResponse({"message": "Проєкт створено", "id": project.id})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# 📌 AI-помічник
@csrf_exempt
@require_http_methods(["POST"])
def ai_help(request):
    data = json.loads(request.body)
    task = data.get("task", "")
    if not task:
        return JsonResponse({"error": "Запит порожній"}, status=400)

    try:
        response = model.generate_content("Відповідай українською: " + task)
        answer = response.text.strip()
        Task.objects.create(title=task, ai_response=answer)
        return JsonResponse({"response": answer})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# 📌 Отримання всіх задач
@csrf_exempt
@require_http_methods(["GET"])
def get_tasks(request):
    tasks = Task.objects.all().order_by('-created_at')
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


# 📌 Видалення задачі
@csrf_exempt
@require_http_methods(["DELETE"])
def delete_task(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    task.delete()
    return JsonResponse({'message': 'Задачу видалено'})


# 📌 Оновлення задачі
@csrf_exempt
@require_http_methods(["PATCH"])
def update_task(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    data = json.loads(request.body)
    new_title = data.get('title', task.title)
    task.title = new_title
    task.save()
    return JsonResponse({'message': 'Задачу оновлено'})


# 👤 Реєстрація користувача
@csrf_exempt
@require_http_methods(["POST"])
def register(request):
    data = json.loads(request.body)
    username = data.get("username")
    password = data.get("password")

    if User.objects.filter(username=username).exists():
        return JsonResponse({"error": "Користувач вже існує"}, status=400)

    User.objects.create(
        username=username,
        password=make_password(password)
    )
    return JsonResponse({"message": "Реєстрація успішна"})


# 🔐 Вхід користувача
@csrf_exempt
@require_http_methods(["POST"])
def login_user(request):
    data = json.loads(request.body)
    username = data.get("username")
    password = data.get("password")
    user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user)
        return JsonResponse({"message": "Успішний вхід"})
    else:
        return JsonResponse({"error": "Невірні дані"}, status=401)


# 🚪 Вихід користувача
@csrf_exempt
@require_http_methods(["POST"])
def logout_user(request):
    logout(request)
    return JsonResponse({"message": "Вихід виконано"})
