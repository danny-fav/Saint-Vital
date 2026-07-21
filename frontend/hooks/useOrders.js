'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/orders';

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.list().then(r => r.data),
  });
}

export function useOrderHistory() {
  return useQuery({
    queryKey: ['orders', 'history'],
    queryFn: () => orderService.history().then(r => r.data),
  });
}

export function useOrder(id) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.detail(id).then(r => r.data),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => orderService.create(data).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}
