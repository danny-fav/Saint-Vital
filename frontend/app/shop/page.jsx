"use client";

import { Suspense, useCallback, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { PageShell, PageHero } from "@/components/site/PageShell";
import { ProductCard } from "@/components/site/ProductCard";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { SlidersHorizontal, Search, ChevronLeft, ChevronRight, X } from "lucide-react";

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

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {[...Array(4)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCategory = searchParams.get("category__slug") || "";
  const currentSearch = searchParams.get("search") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const currentOrdering = searchParams.get("ordering") || "";

  const apiParams = useMemo(() => {
    const params = { page: currentPage };
    if (currentSearch) params.search = currentSearch;
    if (currentCategory) params.category__slug = currentCategory;
    if (currentOrdering) params.ordering = currentOrdering;
    return params;
  }, [currentPage, currentSearch, currentCategory, currentOrdering]);

  const { data, isPending, error, refetch } = useProducts(apiParams);
  const { data: categories } = useCategories();

  const updateParam = useCallback(
    (key, value) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      if (key !== "page") {
        params.delete("page");
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  const sortValue =
    currentOrdering === "-created_at"
      ? "newest"
      : currentOrdering === "price"
        ? "price-asc"
        : currentOrdering === "-price"
          ? "price-desc"
          : "featured";

  const handleSortChange = (value) => {
    const ordering =
      value === "featured"
        ? ""
        : value === "price-asc"
          ? "price"
          : value === "price-desc"
            ? "-price"
            : value === "newest"
              ? "-created_at"
              : "";
    updateParam("ordering", ordering);
  };

  const clearSearch = () => updateParam("search", "");

  const clearFilters = () => {
    router.push(pathname);
  };

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
            <button
              onClick={() => updateParam("category__slug", "")}
              className={`text-xs tracking-[0.2em] uppercase transition ${
                !currentCategory
                  ? "text-[color:var(--gold)]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            {categories?.results?.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => updateParam("category__slug", cat.slug)}
                className={`text-xs tracking-[0.2em] uppercase transition ${
                  currentCategory === cat.slug
                    ? "text-[color:var(--gold)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                defaultValue={currentSearch}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateParam("search", e.target.value.trim());
                  }
                }}
                className="bg-transparent border border-border pl-9 pr-9 py-2 text-xs tracking-[0.2em] uppercase text-foreground outline-none w-40"
              />
              {currentSearch && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            <select
              value={sortValue}
              onChange={(e) => handleSortChange(e.target.value)}
              className="bg-transparent border border-border px-4 py-2 text-xs tracking-[0.2em] uppercase text-foreground outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price · Low to High</option>
              <option value="price-desc">Price · High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        {isPending ? (
          <ProductGridSkeleton />
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-xs tracking-[0.2em] uppercase text-destructive">
              Failed to load products
            </p>
            <button
              onClick={() => refetch()}
              className="btn-outline-gold mt-6"
            >
              Try Again
            </button>
          </div>
        ) : data?.results?.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
              No products found
            </p>
            <button
              onClick={clearFilters}
              className="btn-outline-gold mt-6"
            >
              Browse Shop
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs text-muted-foreground mb-6 tracking-[0.2em] uppercase">
              {data?.count || 0} pieces
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {data?.results?.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {data && data.count > 0 && (
              <div className="flex items-center justify-center gap-6 mt-16">
                <button
                  onClick={() => updateParam("page", String(currentPage - 1))}
                  disabled={!data.previous}
                  className="flex items-center gap-1 text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition disabled:opacity-30 disabled:pointer-events-none"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Prev
                </button>
                <span className="text-xs tracking-[0.2em] text-muted-foreground">
                  Page {currentPage}
                </span>
                <button
                  onClick={() => updateParam("page", String(currentPage + 1))}
                  disabled={!data.next}
                  className="flex items-center gap-1 text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition disabled:opacity-30 disabled:pointer-events-none"
                >
                  Next <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </PageShell>
  );
}

function SuspenseFallback() {
  return (
    <PageShell>
      <PageHero
        eyebrow="The Boutique"
        title="Shop Collection"
        subtitle="Every piece is a study in craft. Browse our latest collection."
      />
      <section className="container-lux pb-24">
        <ProductGridSkeleton />
      </section>
    </PageShell>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <ShopContent />
    </Suspense>
  );
}