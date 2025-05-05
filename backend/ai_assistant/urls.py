from django.urls import path
from .views import (
    ai_help,
    get_tasks,
    delete_task,
    update_task,
    create_project,
    register,
    login_user,
    logout_user,
    send_feedback
)

urlpatterns = [
    path("api/ai/", ai_help),
    path("api/tasks/", get_tasks),
    path("api/tasks/<int:task_id>/", delete_task),
    path("api/tasks/<int:task_id>/update/", update_task),
    path("api/projects/", create_project),
    path("api/register/", register),
    path("api/login/", login_user),
    path("api/logout/", logout_user),
    path("api/feedback/", send_feedback),
]
