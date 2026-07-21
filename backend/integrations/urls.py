from django.urls import path
from . import views

urlpatterns = [
    path('status/', views.IntegrationStatusView.as_view(), name='integration-status'),
    path('<str:provider>/config/', views.IntegrationConfigView.as_view(), name='integration-config'),
    path('<str:provider>/sync/<str:sync_type>/', views.TriggerSyncView.as_view(), name='integration-sync'),
    path('sync-logs/', views.SyncLogListView.as_view(), name='integration-sync-logs'),
]
