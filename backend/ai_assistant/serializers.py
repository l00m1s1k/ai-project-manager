from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    login = serializers.CharField(source='user.username', required=False)
    name = serializers.CharField(source='user.first_name', required=False)
    email = serializers.EmailField(source='user.email', required=False)
    avatar = serializers.ImageField(required=False)

    class Meta:
        model = Profile
        fields = ['login', 'name', 'email', 'avatar']
        extra_kwargs = {
            'login': {'write_only': True},
            'name': {'write_only': True},
            'email': {'write_only': True}
        }

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        user = instance.user

        if 'username' in user_data:
            user.username = user_data['username']
        if 'first_name' in user_data:
            user.first_name = user_data['first_name']
        user.save()

        if 'avatar' in validated_data:
            instance.avatar = validated_data['avatar']
        instance.save()

        return instance