from django.contrib import admin
from .models import IntegrationConfig, SyncLog, FulfillmentSync, ShipmentTracking


@admin.register(IntegrationConfig)
class IntegrationConfigAdmin(admin.ModelAdmin):
    list_display = ['provider', 'is_active', 'updated_at']


@admin.register(SyncLog)
class SyncLogAdmin(admin.ModelAdmin):
    list_display = ['integration', 'sync_type', 'status', 'created_at']
    list_filter = ['sync_type', 'status']


@admin.register(FulfillmentSync)
class FulfillmentSyncAdmin(admin.ModelAdmin):
    list_display = ['order', 'status', 'tracking_number', 'carrier']


@admin.register(ShipmentTracking)
class ShipmentTrackingAdmin(admin.ModelAdmin):
    list_display = ['fulfillment', 'status', 'timestamp']
