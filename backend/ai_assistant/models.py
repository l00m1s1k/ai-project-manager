from django.db import models

class Task(models.Model):
    user = models.ForeignKey("auth.User", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    ai_response = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Project(models.Model):
    title = models.CharField(max_length=255)
    status = models.CharField(max_length=50)
    category = models.CharField(max_length=100)
    progress = models.IntegerField(default=0)
    deadline = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.title

class Feedback(models.Model):
    name = models.CharField(max_length=100)
    message = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.submitted_at.strftime('%Y-%m-%d %H:%M')})"
