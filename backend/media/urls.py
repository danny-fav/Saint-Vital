from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.ImageUploadView.as_view(), name='image-upload'),
    path('upload/avatar/', views.AvatarUploadView.as_view(), name='avatar-upload'),
]
