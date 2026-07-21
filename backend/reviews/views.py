from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Review
from .serializers import ReviewSerializer, ReviewCreateSerializer
from products.models import Product
from orders.models import OrderItem
from core.permissions import IsAdminUser


class ProductReviewListView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Review.objects.filter(product_id=self.kwargs['product_id'], is_approved=True)


class CreateReviewView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, product_id):
        product = Product.objects.get(id=product_id)
        if Review.objects.filter(user=request.user, product=product).exists():
            return Response({'error': 'You already reviewed this product'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = ReviewCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        has_purchased = OrderItem.objects.filter(
            order__user=request.user, product=product,
            order__status__in=['delivered']
        ).exists()
        review = Review.objects.create(
            user=request.user,
            product=product,
            rating=serializer.validated_data['rating'],
            title=serializer.validated_data.get('title', ''),
            content=serializer.validated_data.get('content', ''),
            is_verified_purchase=has_purchased,
        )
        return Response(ReviewSerializer(review).data, status=status.HTTP_201_CREATED)


class ModerateReviewView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def patch(self, request, review_id):
        try:
            review = Review.objects.get(id=review_id)
        except Review.DoesNotExist:
            return Response({'error': 'Review not found'}, status=status.HTTP_404_NOT_FOUND)
        review.is_approved = request.data.get('is_approved', review.is_approved)
        review.save()
        return Response(ReviewSerializer(review).data)


class PendingReviewsView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def get_queryset(self):
        return Review.objects.filter(is_approved=False)
