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
    submit_feedback
)

urlpatterns = [
    path("ai-help/", ai_help, name="ai_help"),
    path("tasks/", get_tasks, name="get_tasks"),
    path("tasks/<int:task_id>/", delete_task, name="delete_task"),
    path("tasks/<int:task_id>/update/", update_task, name="update_task"),
    path("projects/", create_project, name="create_project"),
    path("register/", register, name="register"),
    path("login/", login_user, name="login_user"),
    path("logout/", logout_user, name="logout_user"),
    path("feedback/", submit_feedback, name="submit_feedback"),
]