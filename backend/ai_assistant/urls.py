from django.contrib import admin
from django.urls import path
from backend.ai_assistant.views import ai_help, get_tasks
from django.http import JsonResponse

def root_check(request):
    return JsonResponse({'status': 'ok'})

urlpatterns = [
    path('admin/', admin.site.urls),

    # Перевірка доступності
    path('', root_check),

    # 🔧 Основні API-шляхи
    path('api/ai-help/', ai_help, name='ai_help'),
    path('api/tasks/', get_tasks, name='get_tasks'),
]
