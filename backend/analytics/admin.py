from django.contrib import admin
from .models import DashboardMetric


@admin.register(DashboardMetric)
class DashboardMetricAdmin(admin.ModelAdmin):
    list_display = ['date', 'metric_type', 'value']
    list_filter = ['metric_type']
    date_hierarchy = 'date'
