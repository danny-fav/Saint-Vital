"use client";

import Image from "next/image";
import Link from "next/link";
import { PageShell, PageHero } from "@/components/site/PageShell";
import { Heart, ShoppingBag, Trash2, Loader2 } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/hooks/useAuth";
import { cartService } from "@/services/cart";
import { useState } from "react";

function WishlistGridSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="card-lux overflow-hidden animate-pulse">
          <div className="aspect-[4/5] bg-[color:var(--surface)]" />
          <div className="p-4 space-y-3">
            <div className="h-4 w-3/4 bg-[color:var(--surface)] rounded" />
            <div className="h-4 w-16 bg-[color:var(--surface)] rounded" />
            <div className="flex gap-2">
              <div className="h-9 flex-1 bg-[color:var(--surface)] rounded" />
              <div className="h-9 w-9 bg-[color:var(--surface)] rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function WishlistPage() {
  const { isAuthenticated } = useAuth();
  const { wishlist, loading, removeItem } = useWishlist();
  const [addingId, setAddingId] = useState(null);

  if (!isAuthenticated) {
    return (
      <PageShell>
        <PageHero
          eyebrow="Wishlist"
          title="Saved Items"
          subtitle="Items you love, all in one place."
        />
        <section className="container-lux pb-24 text-center">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="mt-6 text-muted-foreground">Sign in to view your wishlist.</p>
          <Link href="/auth" className="btn-gold btn-gold-hover mt-6 inline-flex">
            Sign In
          </Link>
        </section>
      </PageShell>
    );
  }

  if (loading) {
    return (
      <PageShell>
        <PageHero
          eyebrow="Wishlist"
          title="Saved Items"
          subtitle="Items you love, all in one place."
        />
        <section className="container-lux pb-24">
          <WishlistGridSkeleton />
        </section>
      </PageShell>
    );
  }

  if (!wishlist || wishlist.items.length === 0) {
    return (
      <PageShell>
        <PageHero
          eyebrow="Wishlist"
          title="Saved Items"
          subtitle="Items you love, all in one place."
        />
        <section className="container-lux pb-24 text-center">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="mt-6 text-muted-foreground">Your wishlist is empty.</p>
          <Link href="/shop" className="btn-gold btn-gold-hover mt-6 inline-flex">
            Browse Shop
          </Link>
        </section>
      </PageShell>
    );
  }

  const handleAddToCart = async (item) => {
    setAddingId(item.id);
    try {
      await cartService.add({ product_id: item.product.id });
    } catch {}
    setAddingId(null);
  };

  return (
    <PageShell>
      <PageHero
        eyebrow="Wishlist"
        title="Saved Items"
        subtitle={`${wishlist.items.length} item${wishlist.items.length > 1 ? "s" : ""} saved.`}
      />
      <section className="container-lux pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.items.map((item) => (
            <div key={item.id} className="card-lux overflow-hidden">
              <Link href={`/product/${item.product.slug}`}>
                <div className="relative aspect-[4/5] bg-[color:var(--surface)]">
                  <Image
                    src={item.product.primary_image?.image || "/placeholder.svg"}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              </Link>
              <div className="p-4">
                <Link href={`/product/${item.product.slug}`}>
                  <h3 className="font-semibold text-sm">{item.product.name}</h3>
                </Link>
                <p className="mt-1 text-sm font-bold text-[color:var(--gold)]">
                  ${item.product.price}
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={addingId === item.id}
                    className="btn-gold btn-gold-hover flex-1 text-xs py-2"
                  >
                    {addingId === item.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <ShoppingBag className="h-3 w-3" />
                    )}
                    {addingId === item.id ? "Adding..." : "Add to Cart"}
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 border border-border hover:border-destructive hover:text-destructive rounded-lg"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}