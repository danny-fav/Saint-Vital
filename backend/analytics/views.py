from decimal import Decimal
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Sum, Count, Avg
from django.db.models.functions import TruncDate
from django.utils import timezone
from datetime import timedelta
from .models import DashboardMetric
from .serializers import DashboardMetricSerializer, DashboardSummarySerializer
from orders.models import Order
from accounts.models import User
from products.models import Product
from core.permissions import IsAdminUser


class DashboardSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def get(self, request):
        today = timezone.now().date()
        total_revenue = Order.objects.filter(status__in=['paid', 'processing', 'fulfilled', 'shipped', 'delivered']).aggregate(Sum('total'))['total__sum'] or 0
        total_orders = Order.objects.count()
        total_customers = User.objects.filter(role='customer').count()
        total_products = Product.objects.filter(status='active').count()
        revenue_today = Order.objects.filter(paid_at__date=today).aggregate(Sum('total'))['total__sum'] or 0
        orders_today = Order.objects.filter(created_at__date=today).count()
        avg_order = Order.objects.filter(status__in=['paid', 'processing', 'fulfilled', 'shipped', 'delivered']).aggregate(Avg('total'))['total__avg'] or 0
        data = {
            'total_revenue': total_revenue,
            'total_orders': total_orders,
            'total_customers': total_customers,
            'total_products': total_products,
            'revenue_today': revenue_today,
            'orders_today': orders_today,
            'average_order_value': round(avg_order, 2),
            'conversion_rate': Decimal('0.00'),
        }
        return Response(data)


class RevenueChartView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def get(self, request):
        days = int(request.query_params.get('days', 30))
        start_date = timezone.now().date() - timedelta(days=days)
        data = (
            Order.objects.filter(paid_at__date__gte=start_date, status__in=['paid', 'processing', 'fulfilled', 'shipped', 'delivered'])
            .annotate(date=TruncDate('paid_at'))
            .values('date')
            .annotate(revenue=Sum('total'), orders=Count('id'))
            .order_by('date')
        )
        return Response(list(data))


class DashboardMetricView(generics.ListAPIView):
    queryset = DashboardMetric.objects.all()
    serializer_class = DashboardMetricSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
