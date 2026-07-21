"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Heart,
  ShoppingBag,
  Truck,
  RotateCcw,
  Shield,
  Minus,
  Plus,
} from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { ProductCard } from "@/components/site/ProductCard";
import { findProduct, products } from "@/lib/data";
import { notFound } from "next/navigation";

export default function ProductPage({ params }) {
  const product = findProduct(params.id);
  if (!product) notFound();

  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);

  const related = products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <PageShell>
      <div className="container-lux pt-8 pb-24">
        <nav className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-8">
          <Link href="/" className="hover:text-[color:var(--gold)]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-[color:var(--gold)]">
            Shop
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Gallery */}
          <div className="grid grid-cols-1 gap-4">
            <div className="product-image aspect-[4/5] bg-[color:var(--surface)]">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[product.image, product.image, product.image].map((img, i) => (
                <div
                  key={i}
                  className="product-image aspect-square bg-[color:var(--surface)]"
                >
                  <img src={img} alt="" />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="lg:pt-6">
            {product.official && (
              <span className="inline-block bg-[color:var(--gold)] text-[color:var(--ink)] text-[0.6rem] tracking-[0.24em] uppercase font-semibold px-2.5 py-1">
                Official
              </span>
            )}
            <h1 className="mt-4 font-display text-4xl md:text-5xl">
              {product.name}
            </h1>
            <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
              <span className="text-[color:var(--gold)]">
                ★ {product.rating}
              </span>
              <span>·</span>
              <span>{product.reviews} reviews</span>
            </div>

            <div className="mt-8 flex items-baseline gap-4">
              <p className="font-display text-3xl text-[color:var(--gold)]">
                ${product.price}
              </p>
              {product.compareAt && (
                <p className="text-lg text-muted-foreground line-through">
                  ${product.compareAt}
                </p>
              )}
            </div>

            <p className="mt-8 text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Colors */}
            <div className="mt-10">
              <p className="text-eyebrow mb-4">Color</p>
              <div className="flex gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`h-10 w-10 rounded-full border-2 transition ${
                      color === c
                        ? "border-[color:var(--gold)]"
                        : "border-border"
                    }`}
                    style={{ backgroundColor: c }}
                    aria-label={`Color ${c}`}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <p className="text-eyebrow">Size</p>
                <button className="text-xs text-muted-foreground link-lux">
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`py-3 text-xs tracking-[0.2em] uppercase border transition ${
                      size === s
                        ? "border-[color:var(--gold)] text-[color:var(--gold)]"
                        : "border-border text-foreground hover:border-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-8 flex items-center gap-6">
              <div className="flex items-center border border-border">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="p-3 hover:text-[color:var(--gold)]"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-10 text-center text-sm">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="p-3 hover:text-[color:var(--gold)]"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
              <button className="btn-gold btn-gold-hover flex-1">
                <ShoppingBag className="h-4 w-4" /> Add to Cart
              </button>
              <button
                aria-label="Wishlist"
                className="h-12 w-12 flex items-center justify-center border border-border hover:border-[color:var(--gold)] hover:text-[color:var(--gold)]"
              >
                <Heart className="h-4 w-4" />
              </button>
            </div>

            <button className="mt-3 btn-outline-gold w-full">Buy Now</button>

            {/* Perks */}
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-border pt-8">
              {[
                [Truck, "Free shipping over $250"],
                [RotateCcw, "30-day returns"],
                [Shield, "Authenticity guaranteed"],
              ].map(([Icon, label]) => {
                const I = Icon;
                return (
                  <div key={label} className="text-center">
                    <I className="h-4 w-4 mx-auto text-[color:var(--gold)]" />
                    <p className="mt-2 text-[0.65rem] tracking-[0.2em] uppercase text-muted-foreground">
                      {label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Related */}
        <section className="mt-32">
          <h2 className="font-display text-3xl mb-10">You may also love</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
