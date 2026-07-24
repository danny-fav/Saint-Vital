"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star, ShoppingBag } from "lucide-react";

export function ProductCard({ product }) {
  const isApi = typeof product.id === "number";

  const image = isApi
    ? product.primary_image?.image || "/placeholder.svg"
    : product.image;
  const linkHref = isApi ? `/product/${product.slug}` : `/product/${product.id}`;
  const compareAt =
    isApi && Number(product.compare_at_price) > 0
      ? product.compare_at_price
      : !isApi
        ? product.compareAt
        : null;
  const isNew = isApi ? product.is_new : product.isNew;
  const colors = isApi
    ? product.available_colors?.map((c) => c.hex) || []
    : product.colors || [];
  const collection = isApi
    ? product.category_name || "Saint Vital"
    : product.collection || "Saint Vital";
  const rating = isApi ? product.rating : product.rating;

  return (
    <div className="group relative">
      <Link href={linkHref} className="block">
        <div className="product-image relative aspect-[4/5] bg-[color:var(--surface)]">
          <Image src={image} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {isNew && <span className="badge-new">New</span>}
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
              {collection}
            </p>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3 w-3 fill-[color:var(--gold)] text-[color:var(--gold)]" />
              {rating}
            </span>
          </div>
          <h3 className="mt-1 font-semibold text-[0.95rem] leading-snug line-clamp-1">
            {product.name}
          </h3>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[0.95rem]">${product.price}</span>
              {compareAt && (
                <span className="text-xs text-muted-foreground line-through">
                  ${compareAt}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {colors.slice(0, 4).map((c) => (
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