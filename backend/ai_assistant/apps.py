from django.apps import AppConfig

class AiAssistantConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'backend.ai_assistant'

    def ready(self):
        import backend.ai_assistant.signals
