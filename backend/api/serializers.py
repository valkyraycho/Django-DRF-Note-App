from typing import Any

from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import Note


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )

    class Meta:
        model = User
        fields = ("id", "username", "password")

    def create(self, validated_data: dict[str, Any]) -> User:
        user = User.objects.create_user(
            username=validated_data["username"], password=validated_data["password"]
        )
        return user


class NoteSerializer(serializers.ModelSerializer):
    author = serializers.CharField(read_only=True)

    class Meta:
        model = Note
        fields = ("id", "title", "content", "created_at", "author")
