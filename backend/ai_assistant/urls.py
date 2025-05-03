from django.urls import path
from .views import ai_help, get_tasks

urlpatterns = [
    path('ai-help/', ai_help, name='ai_help'),
    path('tasks/', get_tasks, name='get_tasks'),
]
