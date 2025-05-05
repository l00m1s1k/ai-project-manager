from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    title = models.CharField(max_length=255)
    ai_response = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    deadline = models.DateTimeField(null=True, blank=True)

class Project(models.Model):
    title = models.CharField(max_length=255)
    status = models.CharField(max_length=100, default='У процесі')
    category = models.CharField(max_length=100, default='Інше')
    progress = models.PositiveIntegerField(default=0)
    deadline = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
