from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import IntegrationConfig, SyncLog
from .serializers import IntegrationConfigSerializer, SyncLogSerializer
from core.permissions import IsAdminUser


class IntegrationConfigView(generics.RetrieveUpdateAPIView):
    serializer_class = IntegrationConfigSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def get_object(self):
        provider = self.kwargs['provider']
        config, _ = IntegrationConfig.objects.get_or_create(provider=provider)
        return config


class SyncLogListView(generics.ListAPIView):
    serializer_class = SyncLogSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    queryset = SyncLog.objects.all()
    filterset_fields = ['integration__provider', 'sync_type', 'status']


class TriggerSyncView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def post(self, request, provider, sync_type):
        try:
            config = IntegrationConfig.objects.get(provider=provider, is_active=True)
        except IntegrationConfig.DoesNotExist:
            return Response({'error': f'{provider} is not configured'}, status=status.HTTP_400_BAD_REQUEST)
        log = SyncLog.objects.create(
            integration=config,
            sync_type=sync_type,
            status='pending',
        )
        # TODO: Trigger async sync task via Celery
        return Response(SyncLogSerializer(log).data, status=status.HTTP_202_ACCEPTED)


class IntegrationStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def get(self, request):
        configs = IntegrationConfig.objects.all()
        data = []
        for config in configs:
            last_sync = config.sync_logs.order_by('-created_at').first()
            data.append({
                'provider': config.provider,
                'is_active': config.is_active,
                'last_sync': SyncLogSerializer(last_sync).data if last_sync else None,
            })
        return Response(data)
