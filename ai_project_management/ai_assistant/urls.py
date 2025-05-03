from django.urls import path
from .views import ai_help, get_tasks, delete_task, update_task
from django.urls import path
from . import views
from .views import create_project

urlpatterns = [
    path('ai-help/', ai_help, name='ai_help'),
    path('tasks/', get_tasks, name='get_tasks'),
    path('tasks/<int:task_id>/delete/', delete_task, name='delete_task'),
    path('tasks/<int:task_id>/update/', update_task, name='update_task'),
    path('api/projects/create/', create_project, name='create_project'),
    # Реєстрація нового користувача
    path('register/', views.register, name='register'),
    # Вхід користувача
    path('login/', views.login_user, name='login'),
]