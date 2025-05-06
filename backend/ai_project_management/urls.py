from django.contrib import admin
from backend.ai_assistant import views
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

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
    path('api/tasks/<int:task_id>/delete/', views.delete_task, name='delete_task'),

    # Projects
    path('api/projects/', views.create_project, name='create_project'),

    # Feedback
    path('api/feedback/', views.submit_feedback, name='submit_feedback'),

    # Профіль  сетінгс
    path('admin/', admin.site.urls),
    path('api/', include('backend.ai_assistant.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

]