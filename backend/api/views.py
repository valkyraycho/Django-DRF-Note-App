from django.contrib.auth.models import User
from rest_framework import generics, serializers
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import Note
from .serializers import NoteSerializer, UserSerializer


class NoteListCreateView(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self) -> list[Note]:
        return Note.objects.filter(author=self.request.user)

    def perform_create(self, serializer: serializers.ModelSerializer) -> None:
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.error)


class NoteDeleteView(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self) -> list[Note]:
        return Note.objects.filter(author=self.request.user)


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)
