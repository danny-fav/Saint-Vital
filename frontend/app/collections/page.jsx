"use client";

import Link from "next/link";
import { PageShell, PageHero } from "@/components/site/PageShell";
import { ProductCard } from "@/components/site/ProductCard";
import { useNewArrivals, useFeaturedProducts, useBestSellers } from "@/hooks/useProducts";

const collections = [
  {
    name: "Autumn MMXXVI",
    description:
      "The house collection. Sculpted silhouettes in obsidian and camel.",
    hook: "newArrivals",
  },
  {
    name: "Noir Essentials",
    description: "Foundational pieces. Made only when ordered.",
    hook: "featured",
  },
  {
    name: "Gilded Editions",
    description: "Limited drops with 18k gold-tone hardware.",
    hook: "bestSellers",
  },
];

const hooks = {
  newArrivals: useNewArrivals,
  featured: useFeaturedProducts,
  bestSellers: useBestSellers,
};

function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/5] bg-[color:var(--surface)] rounded-xl" />
      <div className="pt-3 px-0.5 space-y-2">
        <div className="h-3 w-20 bg-[color:var(--surface)] rounded" />
        <div className="h-4 w-3/4 bg-[color:var(--surface)] rounded" />
        <div className="flex justify-between">
          <div className="h-4 w-16 bg-[color:var(--surface)] rounded" />
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-3 w-3 rounded-full bg-[color:var(--surface)]" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CollectionSection({ collection, idx }) {
  const { data, isPending } = hooks[collection.hook]();
  const products = data?.results || data || [];
  const displayProducts = products.slice(0, 4);

  return (
    <div key={collection.name}>
      <div className="text-center mb-12">
        <p className="text-eyebrow">
          Édition {String(idx + 1).padStart(2, "0")}
        </p>
        <h2 className="mt-4 font-display text-4xl md:text-5xl">
          {collection.name}
        </h2>
        <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
          {collection.description}
        </p>
      </div>
      {isPending ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : displayProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
            No pieces in this collection yet
          </p>
          <Link href="/shop" className="btn-outline-gold mt-6 inline-flex">
            Browse Shop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayProducts.map((p) => (
            <ProductCard key={collection.name + p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Collections() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Editions"
        title="Collections"
        subtitle="Seasonal narratives and limited editions from the Saint Vital studio."
      />
      <section className="container-lux pb-24 space-y-32">
        {collections.map((c, idx) => (
          <CollectionSection key={c.name} collection={c} idx={idx} />
        ))}
      </section>
    </PageShell>
  );
}