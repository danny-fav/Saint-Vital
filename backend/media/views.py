from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings
import cloudinary.uploader


class ImageUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        file = request.FILES.get('file')
        folder = request.data.get('folder', 'uploads')
        if not file:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        use_cloudinary = bool(settings.CLOUDINARY_STORAGE.get('CLOUD_NAME'))
        if use_cloudinary:
            result = cloudinary.uploader.upload(file, folder=folder)
            return Response({
                'url': result['secure_url'],
                'public_id': result['public_id'],
                'width': result.get('width'),
                'height': result.get('height'),
            })
        # Fallback to local storage
        from django.core.files.storage import default_storage
        path = default_storage.save(f'{folder}/{file.name}', file)
        url = default_storage.url(path)
        return Response({'url': url, 'path': path})


class AvatarUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        user = request.user
        use_cloudinary = bool(settings.CLOUDINARY_STORAGE.get('CLOUD_NAME'))
        if use_cloudinary:
            result = cloudinary.uploader.upload(file, folder='avatars')
            user.avatar = result['secure_url']
        else:
            from django.core.files.storage import default_storage
            path = default_storage.save(f'avatars/{user.id}_{file.name}', file)
            user.avatar = path
        user.save()
        return Response({'avatar': user.avatar.url if hasattr(user.avatar, 'url') else user.avatar})
