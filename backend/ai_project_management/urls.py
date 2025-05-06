from django.contrib import admin
from django.urls import path
from backend.ai_assistant import views
from backend.ai_assistant.views import CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # AUTH
    path('api/register/', views.register, name='register'),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # AI Assistant
    path('api/ai-help/', views.ai_help, name='ai_help'),

    # Tasks
    path('api/tasks/', views.get_tasks, name='get_tasks'),
    path('api/tasks/<int:task_id>/', views.update_task, name='update_task'),
    path('api/tasks/<int:task_id>/delete/', views.delete_task, name='delete_task'),

    # Projects
    path('api/projects/', views.create_project, name='create_project'),

    # Feedback
    path('api/feedback/', views.submit_feedback, name='submit_feedback'),

    # Profile
    path('admin/', admin.site.urls),
    path('api/profile/', views.ProfileView.as_view(), name='profile'),
]
