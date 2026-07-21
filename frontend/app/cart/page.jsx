"use client";

import Link from "next/link";
import { PageShell, PageHero } from "@/components/site/PageShell";
import { Minus, Plus, X } from "lucide-react";
import { useState } from "react";
import { products } from "@/lib/data";



export default function Cart() {
  const [items, setItems] = useState(
    products
      .slice(0, 2)
      .map((p) => ({ ...p, qty: 1, size: p.sizes[1] ?? p.sizes[0] })),
  );

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 250 ? 0 : 25;
  const total = subtotal + shipping;

  return (
    <PageShell>
      <PageHero eyebrow="Your Selection" title="Shopping Bag" />
      <section className="container-lux pb-24">
        {items.length === 0 ? (
          <div className="text-center py-20 border border-border">
            <p className="text-muted-foreground">Your bag is empty.</p>
            <Link href="/shop"
              className="btn-gold btn-gold-hover mt-6 inline-flex"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex gap-6 border-b border-border pb-6"
                >
                  <div className="product-image h-40 w-32 flex-shrink-0 bg-[color:var(--surface)]">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-eyebrow">Saint Vital</p>
                        <h3 className="font-display text-xl mt-1">
                          {item.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Size {item.size}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setItems(items.filter((_, i) => i !== idx))
                        }
                        className="text-muted-foreground hover:text-[color:var(--gold)]"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-4 flex justify-between items-end">
                      <div className="inline-flex items-center border border-border">
                        <button
                          onClick={() =>
                            setItems(
                              items.map((it, i) =>
                                i === idx
                                  ? { ...it, qty: Math.max(1, it.qty - 1) }
                                  : it,
                              ),
                            )
                          }
                          className="p-2"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm">
                          {item.qty}
                        </span>
                        <button
                          onClick={() =>
                            setItems(
                              items.map((it, i) =>
                                i === idx ? { ...it, qty: it.qty + 1 } : it,
                              ),
                            )
                          }
                          className="p-2"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="font-display text-[color:var(--gold)]">
                        ${item.price * item.qty}
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
                  <span>${subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {shipping === 0 ? "Complimentary" : `$${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between border-t border-border pt-3 mt-4">
                  <span className="font-display text-lg">Total</span>
                  <span className="font-display text-lg text-[color:var(--gold)]">
                    ${total}
                  </span>
                </div>
              </div>
              <input
                placeholder="Promo code"
                className="w-full bg-transparent border border-border px-4 py-3 text-sm mt-6 outline-none"
              />
              <Link href="/checkout"
                className="btn-gold btn-gold-hover w-full mt-4"
              >
                Checkout
              </Link>
              <Link href="/shop"
                className="block text-center link-lux text-xs tracking-[0.24em] uppercase mt-6 text-muted-foreground"
              >
                Continue Shopping
              </Link>
            </aside>
          </div>
        )}
      </section>
    </PageShell>
  );

}
