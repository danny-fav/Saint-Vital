"use client";

import Link from "next/link";
import { PageShell, PageHero } from "@/components/site/PageShell";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import { products } from "@/lib/data";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState(products.slice(0, 3));

  const removeItem = (id) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  if (wishlist.length === 0) {
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
          <Link href="/shop" className="btn-primary mt-6 inline-flex">
            Browse Products
          </Link>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHero
        eyebrow="Wishlist"
        title="Saved Items"
        subtitle={`${wishlist.length} item${wishlist.length > 1 ? "s" : ""} saved.`}
      />
      <section className="container-lux pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div key={item.id} className="card-lux overflow-hidden">
              <Link href={`/product/${item.id}`}>
                <div className="aspect-[4/5] bg-[color:var(--surface)]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              </Link>
              <div className="p-4">
                <Link href={`/product/${item.id}`}>
                  <h3 className="font-semibold text-sm">{item.name}</h3>
                </Link>
                <p className="mt-1 text-sm font-bold text-[color:var(--gold)]">
                  ${item.price}
                </p>
                <div className="mt-4 flex gap-2">
                  <button className="btn-primary flex-1 text-xs py-2">
                    <ShoppingBag className="h-3 w-3" /> Add to Cart
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 border border-border hover:border-red-500 hover:text-red-500 rounded-lg"
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
