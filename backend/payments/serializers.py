from rest_framework import serializers
from .models import Payment, Transaction


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ['id', 'user', 'status', 'paid_at', 'created_at']


class PaymentInitSerializer(serializers.Serializer):
    provider = serializers.ChoiceField(choices=['paystack', 'flutterwave', 'stripe'])
    redirect_url = serializers.URLField(required=False)


class PaymentVerifySerializer(serializers.Serializer):
    reference = serializers.CharField()
    provider = serializers.ChoiceField(choices=['paystack', 'flutterwave', 'stripe'])


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'
