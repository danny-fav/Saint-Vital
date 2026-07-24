'use client';
import { useState, useEffect, useCallback } from 'react';
import { cartService } from '@/services/cart';
import { useAuth } from './useAuth';

export function useCart() {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await cartService.get();
      setCart(res.data);
    } catch { setCart(null); }
    finally { setLoading(false); }
  }, [isAuthenticated]);

  useEffect(() => { fetchCart(); }, [fetchCart]); // eslint-disable-line react-hooks/set-state-in-effect

  const addItem = useCallback(async (productId, quantity = 1, variantId = null) => {
    const res = await cartService.add({ product_id: productId, variant_id: variantId, quantity });
    setCart(res.data);
    return res.data;
  }, []);

  const updateItem = useCallback(async (itemId, quantity) => {
    const res = await cartService.updateItem(itemId, { quantity });
    setCart(res.data);
    return res.data;
  }, []);

  const removeItem = useCallback(async (itemId) => {
    await cartService.removeItem(itemId);
    setCart((prev) => prev ? { ...prev, items: prev.items.filter(i => i.id !== itemId) } : null);
  }, []);

  const toggleSave = useCallback(async (itemId) => {
    const res = await cartService.toggleSave(itemId);
    setCart(res.data);
  }, []);

  const applyCoupon = useCallback(async (code) => {
    const res = await cartService.applyCoupon(code);
    setCart(res.data);
  }, []);

  const clearCart = useCallback(async () => {
    await cartService.clear();
    setCart(null);
  }, []);

  return { cart, loading, addItem, updateItem, removeItem, toggleSave, applyCoupon, clearCart, refreshCart: fetchCart };
}
