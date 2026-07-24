import uuid
from decimal import Decimal
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Sum, Count, Avg
from django.db.models.functions import TruncDate
from django.utils import timezone
from datetime import timedelta
from .models import DashboardMetric, AnalyticsEvent
from .serializers import DashboardMetricSerializer, DashboardSummarySerializer
from orders.models import Order
from accounts.models import User
from products.models import Product
from core.permissions import IsAdminUser


class DashboardSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def get(self, request):
        today = timezone.now().date()
        paid_statuses = ['paid', 'processing', 'fulfilled', 'shipped', 'delivered']
        paid_orders = Order.objects.filter(status__in=paid_statuses)
        total_revenue = paid_orders.aggregate(Sum('total'))['total__sum'] or 0
        total_orders = Order.objects.count()
        total_customers = User.objects.filter(role='customer').count()
        total_products = Product.objects.filter(status='active').count()
        revenue_today = Order.objects.filter(paid_at__date=today, status__in=paid_statuses).aggregate(Sum('total'))['total__sum'] or 0
        orders_today = Order.objects.filter(created_at__date=today).count()
        avg_order = paid_orders.aggregate(Avg('total'))['total__avg'] or 0
        total_visitors = total_customers or 1
        paid_order_count = paid_orders.count()
        conversion_rate = round((paid_order_count / total_visitors) * 100, 2) if total_visitors > 0 else Decimal('0.00')
        data = {
            'total_revenue': total_revenue,
            'total_orders': total_orders,
            'total_customers': total_customers,
            'total_products': total_products,
            'revenue_today': revenue_today,
            'orders_today': orders_today,
            'average_order_value': round(avg_order, 2),
            'conversion_rate': conversion_rate,
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


class TrackEventView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        event_type = request.data.get('event_type')
        if event_type not in [c[0] for c in AnalyticsEvent.EVENT_TYPES]:
            return Response({'error': 'Invalid event_type'}, status=status.HTTP_400_BAD_REQUEST)
        AnalyticsEvent.objects.create(
            user=request.user if request.user.is_authenticated else None,
            event_type=event_type,
            data=request.data.get('data', {}),
            session_id=request.data.get('session_id', ''),
            ip_address=request.META.get('REMOTE_ADDR', ''),
        )
        return Response({'status': 'ok'})


class DashboardMetricView(generics.ListAPIView):
    queryset = DashboardMetric.objects.all()
    serializer_class = DashboardMetricSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
