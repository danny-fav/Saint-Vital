from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.DashboardSummaryView.as_view(), name='dashboard-summary'),
    path('dashboard/revenue/', views.RevenueChartView.as_view(), name='dashboard-revenue'),
    path('metrics/', views.DashboardMetricView.as_view(), name='dashboard-metrics'),
]
