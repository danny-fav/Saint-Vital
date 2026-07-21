from rest_framework import serializers
from .models import Order, OrderItem, OrderNote


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'product_image', 'price', 'quantity', 'color', 'size', 'total']


class OrderNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderNote
        fields = ['id', 'note', 'is_customer_visible', 'created_at']


class OrderListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'status', 'total', 'payment_method',
            'created_at', 'item_count',
        ]

    item_count = serializers.SerializerMethodField()

    def get_item_count(self, obj):
        return sum(item.quantity for item in obj.items.all())


class OrderDetailSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    notes = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'status', 'subtotal', 'shipping_cost', 'tax',
            'discount', 'total', 'coupon_code', 'shipping_address', 'payment_method',
            'payment_id', 'tracking_number', 'carrier', 'customer_notes',
            'items', 'paid_at', 'shipped_at', 'delivered_at', 'created_at', 'updated_at',
        ]

    def get_notes(self, obj):
        return OrderNoteSerializer(obj.notes.filter(is_customer_visible=True), many=True).data


class CreateOrderSerializer(serializers.Serializer):
    shipping_address = serializers.JSONField()
    billing_address = serializers.JSONField(required=False)
    payment_method = serializers.CharField(required=False)
    notes = serializers.CharField(required=False, allow_blank=True)


class OrderStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['status']
