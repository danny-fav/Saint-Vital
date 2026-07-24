"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
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
import { useAuth } from "@/hooks/useAuth";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { cartService } from "@/services/cart";
import { wishlistService } from "@/services/wishlist";

export default function ProductPage({ params }) {
  const router = useRouter();
  const { data: product, isPending, error } = useProduct(params.id);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const { data: relatedData } = useProducts(
    product?.category ? { category__slug: product.category.slug } : undefined
  );

  if (isPending) {
    return (
      <PageShell>
        <div className="container-lux pt-8 pb-24">
          <div className="animate-pulse space-y-8">
            <div className="h-4 w-48 bg-[color:var(--surface)] rounded" />
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
              <div className="aspect-[4/5] bg-[color:var(--surface)]" />
              <div className="space-y-6 lg:pt-6">
                <div className="h-6 w-16 bg-[color:var(--surface)] rounded" />
                <div className="h-10 w-3/4 bg-[color:var(--surface)] rounded" />
                <div className="h-4 w-44 bg-[color:var(--surface)] rounded" />
                <div className="h-8 w-32 bg-[color:var(--surface)] rounded" />
                <div className="h-20 w-full bg-[color:var(--surface)] rounded" />
                <div className="flex gap-3">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-10 w-10 rounded-full bg-[color:var(--surface)]"
                    />
                  ))}
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-11 bg-[color:var(--surface)] rounded"
                    />
                  ))}
                </div>
                <div className="h-12 w-full bg-[color:var(--surface)] rounded" />
              </div>
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  if (error || !product) notFound();

  const primaryImage =
    product.images?.find((i) => i.is_primary) || product.images?.[0];
  const thumbnails = product.images?.slice(0, 3) || [];
  const relatedProducts = (relatedData?.results || relatedData || [])
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const activeColor = selectedColor || product.available_colors?.[0];
  const activeSize = selectedSize || product.available_sizes?.[0];

  const selectedVariant = product.variants?.find(
    (v) => v.color === activeColor?.id && v.size === activeSize?.id
  );

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      await cartService.add({
        product_id: product.id,
        quantity: qty,
        variant_id: selectedVariant?.id,
      });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch {
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlistToggle = async () => {
    try {
      await wishlistService.add(product.id);
    } catch {}
  };

  const handleBuyNow = async () => {
    try {
      await cartService.add({
        product_id: product.id,
        quantity: qty,
        variant_id: selectedVariant?.id,
      });
      router.push("/auth?redirect=/checkout");
    } catch {}
  };

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
              <Image
                src={primaryImage?.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            {thumbnails.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {thumbnails.map((img, i) => (
                    <div
                      key={img.id || i}
                      className="product-image aspect-square bg-[color:var(--surface)]"
                    >
                      <Image src={img.image} alt={img.alt_text || ""} fill className="object-cover" sizes="150px" />
                    </div>
                ))}
              </div>
            )}
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
              <span>{product.review_count} reviews</span>
            </div>

            <div className="mt-8 flex items-baseline gap-4">
              <p className="font-display text-3xl text-[color:var(--gold)]">
                ${product.price}
              </p>
              {Number(product.compare_at_price) > 0 && (
                <p className="text-lg text-muted-foreground line-through">
                  ${product.compare_at_price}
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
                {product.available_colors?.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedColor(c)}
                    className={`h-10 w-10 rounded-full border-2 transition ${
                      activeColor?.id === c.id
                        ? "border-[color:var(--gold)]"
                        : "border-border"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    aria-label={`Color ${c.name}`}
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
                {product.available_sizes?.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSize(s)}
                    className={`py-3 text-xs tracking-[0.2em] uppercase border transition ${
                      activeSize?.id === s.id
                        ? "border-[color:var(--gold)] text-[color:var(--gold)]"
                        : "border-border text-foreground hover:border-foreground"
                    }`}
                  >
                    {s.name}
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
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="btn-gold btn-gold-hover flex-1"
              >
                <ShoppingBag className="h-4 w-4" />
                {addedToCart
                  ? " Added!"
                  : addingToCart
                    ? " Adding..."
                    : " Add to Cart"}
              </button>
              <button
                onClick={handleWishlistToggle}
                aria-label="Wishlist"
                className="h-12 w-12 flex items-center justify-center border border-border hover:border-[color:var(--gold)] hover:text-[color:var(--gold)]"
              >
                <Heart className="h-4 w-4" />
              </button>
            </div>

            <button onClick={handleBuyNow} className="mt-3 btn-outline-gold w-full">
              Buy Now
            </button>

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
        {relatedProducts.length > 0 && (
          <section className="mt-32">
            <h2 className="font-display text-3xl mb-10">You may also love</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </PageShell>
  );
}
