from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def root_check(request):
    return JsonResponse({'status': 'ok'})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', root_check),

    # 🔥 Ось це обов'язково:
    path('api/', include('backend.ai_assistant.urls')),
]
