from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, include

def health_check(request):
    return JsonResponse({'status': 'ok'})

urlpatterns = [
    path('', health_check),
    path('admin/', admin.site.urls),
    path('api/', include('backend.ai_assistant.urls')),
]
