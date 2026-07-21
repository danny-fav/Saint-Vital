"use client";


import { useState } from "react";
import { PageShell, PageHero } from "@/components/site/PageShell";
import { ProductCard } from "@/components/site/ProductCard";
import { products } from "@/lib/data";
import { SlidersHorizontal } from "lucide-react";



const cats = [
  "All",
  "Hoodies",
  "T-Shirts",
  "Jackets",
  "Men",
  "Women",
  "Accessories",
];

export default function Shop() {
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("featured");

  const filtered = products.filter((p) => cat === "All" || p.category === cat);
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    return 0;
  });

  return (
    <PageShell>
      <PageHero
        eyebrow="The Boutique"
        title="Shop Collection"
        subtitle="Every piece is a study in craft. Browse our latest collection."
      />

      <section className="container-lux pb-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-y border-border py-4 mb-12">
          <div className="flex flex-wrap gap-x-6 gap-y-2 items-center">
            <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground flex items-center gap-2">
              <SlidersHorizontal className="h-3.5 w-3.5" /> Filter
            </span>
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`text-xs tracking-[0.2em] uppercase transition ${
                  cat === c
                    ? "text-[color:var(--gold)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent border border-border px-4 py-2 text-xs tracking-[0.2em] uppercase text-foreground outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price · Low to High</option>
              <option value="price-desc">Price · High to Low</option>
            </select>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-6 tracking-[0.2em] uppercase">
          {sorted.length} pieces
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {sorted.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </PageShell>
  );

}
