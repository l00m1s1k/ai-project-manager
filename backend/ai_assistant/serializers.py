from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email']

class ProfileSerializer(serializers.ModelSerializer):
    login = serializers.CharField(source='user.username', required=False)
    email = serializers.EmailField(source='user.email', required=False)
    avatar = serializers.ImageField(required=False, allow_null=True)
    name = serializers.CharField(source='user.first_name', required=False)

    class Meta:
        model = Profile
        fields = ['login', 'email', 'name', 'avatar']

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        user = instance.user

        user.username = user_data.get('username', user.username)
        user.first_name = user_data.get('first_name', user.first_name)
        user.email = user_data.get('email', user.email)
        user.save()

        instance.avatar = validated_data.get('avatar', instance.avatar)
        instance.save()
        return instance