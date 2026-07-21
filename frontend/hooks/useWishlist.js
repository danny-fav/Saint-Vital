'use client';
import { useState, useEffect, useCallback } from 'react';
import { wishlistService } from '@/services/wishlist';
import { useAuth } from './useAuth';

export function useWishlist() {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await wishlistService.get();
      setWishlist(res.data);
    } catch { setWishlist(null); }
    finally { setLoading(false); }
  }, [isAuthenticated]);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const addItem = useCallback(async (productId) => {
    const res = await wishlistService.add(productId);
    setWishlist(res.data);
    return res.data;
  }, []);

  const removeItem = useCallback(async (itemId) => {
    await wishlistService.remove(itemId);
    setWishlist((prev) => prev ? { ...prev, items: prev.items.filter(i => i.id !== itemId) } : null);
  }, []);

  const isInWishlist = useCallback((productId) => {
    return wishlist?.items?.some(i => i.product?.id === productId || i.product === productId) ?? false;
  }, [wishlist]);

  return { wishlist, loading, addItem, removeItem, isInWishlist, refreshWishlist: fetchWishlist };
}
