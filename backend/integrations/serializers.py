from rest_framework import serializers
from .models import IntegrationConfig, SyncLog, FulfillmentSync


class IntegrationConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = IntegrationConfig
        fields = ['id', 'provider', 'api_key', 'api_url', 'shop_id', 'is_active', 'config', 'created_at', 'updated_at']
        extra_kwargs = {'api_key': {'write_only': True}}


class SyncLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = SyncLog
        fields = '__all__'


class FulfillmentSyncSerializer(serializers.ModelSerializer):
    class Meta:
        model = FulfillmentSync
        fields = '__all__'
