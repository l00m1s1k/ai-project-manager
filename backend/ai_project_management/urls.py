from django.urls import path, include
from django.contrib import admin
from backend.ai_assistant import views
from django.conf import settings

urlpatterns = [
    # AUTH
    path('api/register/', views.register, name='register'),
    path('api/login/', views.login_user, name='login'),
    path('api/logout/', views.logout_user, name='logout'),

    # AI Assistant
    path('api/ai-help/', views.ai_help, name='ai_help'),

    # Tasks
    path('api/tasks/', views.get_tasks, name='get_tasks'),
    path('api/tasks/<int:task_id>/', views.update_task, name='update_task'),
    path('api/tasks/<int:task_id>/delete/', views.delete_task, name='delete_task'),  # Додано /delete/

    # Projects
    path('api/projects/', views.create_project, name='create_project'),

    # Feedback
    path('api/feedback/', views.submit_feedback, name='submit_feedback'),  # Додано шлях для feedback

    # Додано адмінку
    path('admin/', admin.site.urls),
    path('api/', include('backend.ai_assistant.urls')),
]