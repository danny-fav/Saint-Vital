"use client";

import Image from "next/image";
import Link from "next/link";
import { PageShell, PageHero } from "@/components/site/PageShell";
import { Minus, Plus, X, LogIn } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";

export default function Cart() {
  const { isAuthenticated } = useAuth();
  const { cart, loading, updateItem, removeItem, applyCoupon } = useCart();
  const [promo, setPromo] = useState("");

  const handleApplyCoupon = async () => {
    if (promo.trim()) {
      try { await applyCoupon(promo.trim()); } catch {}
    }
  };

  if (!isAuthenticated) {
    return (
      <PageShell>
        <PageHero eyebrow="Your Selection" title="Shopping Bag" />
        <section className="container-lux pb-24">
          <div className="text-center py-20 border border-border">
            <LogIn className="mx-auto h-8 w-8 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Sign in to view your bag.</p>
            <Link href="/auth" className="btn-gold btn-gold-hover mt-6 inline-flex">
              Sign In
            </Link>
          </div>
        </section>
      </PageShell>
    );
  }

  if (loading) {
    return (
      <PageShell>
        <PageHero eyebrow="Your Selection" title="Shopping Bag" />
        <section className="container-lux pb-24">
          <div className="animate-pulse space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-6 border-b border-border pb-6">
                <div className="h-40 w-32 bg-[color:var(--surface)]" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-24 bg-[color:var(--surface)]" />
                  <div className="h-6 w-40 bg-[color:var(--surface)]" />
                  <div className="h-4 w-16 bg-[color:var(--surface)]" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </PageShell>
    );
  }

  const items = cart?.items ?? [];

  return (
    <PageShell>
      <PageHero eyebrow="Your Selection" title="Shopping Bag" />
      <section className="container-lux pb-24">
        {items.length === 0 ? (
          <div className="text-center py-20 border border-border">
            <p className="text-muted-foreground">Your bag is empty.</p>
            <Link href="/shop" className="btn-gold btn-gold-hover mt-6 inline-flex">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-6 border-b border-border pb-6"
                >
                  <div className="product-image h-40 w-32 flex-shrink-0 bg-[color:var(--surface)]">
                    <Image src={item.product.primary_image?.image || item.product.images?.[0]?.image || "/placeholder.svg"} alt={item.product.name} fill className="object-cover" sizes="128px" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-eyebrow">Saint Vital</p>
                        <h3 className="font-display text-xl mt-1">
                          {item.product.name}
                        </h3>
                        {item.variant_detail && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.variant_detail.color_name} / {item.variant_detail.size_name}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-[color:var(--gold)]"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-4 flex justify-between items-end">
                      <div className="inline-flex items-center border border-border">
                        <button
                          onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                          className="p-2"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateItem(item.id, item.quantity + 1)}
                          className="p-2"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="font-display text-[color:var(--gold)]">
                        ${item.total}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="card-lux p-8 h-fit sticky top-28">
              <h3 className="font-display text-2xl">Summary</h3>
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${cart.subtotal}</span>
                </div>
                {cart.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="text-muted-foreground">Discount</span>
                    <span>-${cart.discount}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-border pt-3 mt-4">
                  <span className="font-display text-lg">Total</span>
                  <span className="font-display text-lg text-[color:var(--gold)]">
                    ${cart.total}
                  </span>
                </div>
              </div>
              <div className="mt-6 flex gap-2">
                <input
                  placeholder="Promo code"
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                  className="flex-1 bg-transparent border border-border px-4 py-3 text-sm outline-none"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="btn-outline-gold text-xs px-4"
                >
                  Apply
                </button>
              </div>
              <Link href="/checkout" className="btn-gold btn-gold-hover w-full mt-4 block text-center">
                Checkout
              </Link>
              <Link href="/shop" className="block text-center link-lux text-xs tracking-[0.24em] uppercase mt-6 text-muted-foreground">
                Continue Shopping
              </Link>
            </aside>
          </div>
        )}
      </section>
    </PageShell>
  );
}
