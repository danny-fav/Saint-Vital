"use client";

import Link from "next/link";
import { Heart, Star, ShoppingBag } from "lucide-react";

export function ProductCard({ product }) {
  return (
    <div className="group relative">
      <Link href={`/product/${product.id}`} className="block">
        <div className="product-image relative aspect-[4/5] bg-[color:var(--surface)]">
          <img src={product.image} alt={product.name} loading="lazy" />
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.official && (
              <span className="badge-official">✓ Official</span>
            )}
            {product.isNew && <span className="badge-new">New</span>}
          </div>
          <button
            aria-label="Add to wishlist"
            className="absolute top-3 right-3 h-9 w-9 flex items-center justify-center bg-background/95 backdrop-blur rounded-full text-foreground hover:text-[color:var(--gold)] shadow-sm transition"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <Heart className="h-4 w-4" />
          </button>
          <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={(e) => e.preventDefault()}
              className="w-full bg-foreground text-background py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-foreground/90"
            >
              <ShoppingBag className="h-4 w-4" /> Quick Add
            </button>
          </div>
        </div>
        <div className="pt-3 px-0.5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground truncate">
              {product.collection || "Saint Vital"}
            </p>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3 w-3 fill-[color:var(--gold)] text-[color:var(--gold)]" />
              {product.rating}
            </span>
          </div>
          <h3 className="mt-1 font-semibold text-[0.95rem] leading-snug line-clamp-1">
            {product.name}
          </h3>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[0.95rem]">${product.price}</span>
              {product.compareAt && (
                <span className="text-xs text-muted-foreground line-through">
                  ${product.compareAt}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {product.colors.slice(0, 4).map((c) => (
                <span
                  key={c}
                  className="h-3 w-3 rounded-full border border-border"
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
