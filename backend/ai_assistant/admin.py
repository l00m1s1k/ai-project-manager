from django.contrib import admin
from .models import Task, Project, Feedback

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'created_at')
    search_fields = ('title', 'ai_response')
    list_filter = ('created_at',)

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'category', 'progress', 'deadline')
    search_fields = ('title',)
    list_filter = ('status', 'category')

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('name', 'submitted_at')
    search_fields = ('name', 'message')
    readonly_fields = ('name', 'message', 'submitted_at')
    ordering = ('-submitted_at',)
