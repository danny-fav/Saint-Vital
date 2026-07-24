"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Shield,
  Truck,
  RotateCcw,
  Star,
} from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { ProductCard } from "@/components/site/ProductCard";
import {
  useFeaturedProducts,
  useNewArrivals,
  useBestSellers,
  useCategories,
} from "@/hooks/useProducts";

export default function Home() {
  const { data: featuredData, isPending: featuredLoading } =
    useFeaturedProducts();
  const { data: newArrivalsData, isPending: newArrivalsLoading } =
    useNewArrivals();
  const { data: bestSellersData, isPending: bestSellersLoading } =
    useBestSellers();
  const { data: categoriesData, isPending: categoriesLoading } =
    useCategories();

  const featured = featuredData?.results || featuredData || [];
  const newArrivals = newArrivalsData?.results || newArrivalsData || [];
  const bestSellers = bestSellersData?.results || bestSellersData || [];
  const categories = categoriesData?.results || categoriesData || [];

  return (
    <PageShell>
      {/* Hero */}
      <section className="bg-[color:var(--surface)]">
        <div className="container-lux grid md:grid-cols-2 gap-8 items-center py-10 md:py-16 min-h-[70vh]">
          <div className="order-2 md:order-1">
            <span className="inline-flex items-center gap-2 text-xs font-semibold bg-card border border-border px-3 py-1 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--gold)]" />
              New Season
            </span>
            <h1 className="mt-4 font-display text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
              Clean. Classic.{" "}
              <span className="text-[color:var(--gold)]">Yours.</span>
            </h1>
            <p className="mt-4 text-base text-muted-foreground max-w-md leading-relaxed">
              Premium essentials designed for those who value quality,
              craftsmanship, and timeless style.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/shop" className="btn-primary">
                Shop Now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/collections" className="btn-ghost-outline">
                View Collections
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                <Truck className="h-4 w-4" /> Free shipping over $150
              </span>
              <span className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" /> 30-day returns
              </span>
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4" /> Secure checkout
              </span>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="relative aspect-[4/5] md:aspect-[5/6] overflow-hidden rounded-2xl bg-background">
              <Image
                src="/assets/hero-model.jpg"
                alt="Saint Vital campaign"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute bottom-4 left-4 right-4 bg-card/95 backdrop-blur rounded-xl p-3 flex items-center justify-between shadow-lg">
                <div>
                  <p className="text-[0.65rem] font-bold tracking-wide uppercase text-[color:var(--gold)]">
                    Featured
                  </p>
                  <p className="text-sm font-semibold">
                    {featuredLoading
                      ? "Loading..."
                      : featured?.[0]?.name || "Vital Monogram Hoodie"}
                  </p>
                </div>
                <Link href="/shop" className="btn-primary !py-1.5 !px-3 !text-xs">
                  Shop
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-lux py-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-extrabold">
              Shop by category
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Find your style.
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden md:inline-flex items-center gap-1 text-sm font-semibold hover:text-[color:var(--gold)]"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {categoriesLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl bg-[color:var(--surface)] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/shop?category=${c.slug}`}
                className="group relative aspect-square overflow-hidden rounded-xl bg-[color:var(--surface)]"
              >
                <Image
                  src={c.image || `/assets/category-${c.slug}.jpg`}
                  alt={c.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <p className="text-white font-bold text-sm">{c.name}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Collections */}
      <section className="bg-[color:var(--surface)] py-14">
        <div className="container-lux">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-extrabold">
                Collections
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Curated for every occasion.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {categories.slice(0, 3).map((col) => (
              <Link
                key={col.id}
                href={`/shop?category=${col.slug}`}
                className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-background"
              >
                <Image
                  src={col.image || "/assets/product-hoodie.jpg"}
                  alt={col.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-white font-bold text-lg">{col.name}</p>
                  <p className="text-white/70 text-sm mt-1">{col.description || "Curated essentials."}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container-lux py-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-extrabold">
              New arrivals
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Fresh drops.
            </p>
          </div>
          <Link
            href="/shop?sort=newest"
            className="text-sm font-semibold hover:text-[color:var(--gold)] inline-flex items-center gap-1"
          >
            See all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {newArrivalsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[4/5] rounded-xl bg-[color:var(--surface)] animate-pulse" />
                <div className="h-4 w-24 bg-[color:var(--surface)] rounded animate-pulse" />
                <div className="h-5 w-32 bg-[color:var(--surface)] rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {newArrivals.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Best Sellers */}
      <section className="bg-[color:var(--surface)] py-14">
        <div className="container-lux">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-extrabold">
                Best sellers
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Loved by customers.
              </p>
            </div>
            <Link
              href="/shop"
              className="text-sm font-semibold hover:text-[color:var(--gold)] inline-flex items-center gap-1"
            >
              Shop all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {bestSellersLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-[4/5] rounded-xl bg-[color:var(--surface)] animate-pulse" />
                  <div className="h-4 w-24 bg-[color:var(--surface)] rounded animate-pulse" />
                  <div className="h-5 w-32 bg-[color:var(--surface)] rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {bestSellers.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About */}
      <section className="container-lux py-14">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-eyebrow">Our Story</span>
            <h2 className="mt-4 font-display text-3xl md:text-4xl font-extrabold">
              Designed to last.
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Saint Vital was founded on a simple idea: modern essentials
              that don&apos;t compromise on quality. Every piece is crafted
              with intention, built to last, and designed to be worn for years.
            </p>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              We believe in thoughtful design, premium materials, and
              the kind of quiet confidence that doesn&apos;t need a logo
              to speak for itself.
            </p>
            <Link
              href="/about"
              className="btn-ghost-outline mt-6 inline-flex"
            >
              Learn more <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[color:var(--surface)]">
            <Image
              src="/assets/hero-model.jpg"
              alt="Saint Vital"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-[color:var(--surface)] py-14">
        <div className="container-lux">
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-center">
            Loved by customers
          </h2>
          <p className="text-sm text-muted-foreground text-center mt-1">
            4.8 average from 1,200+ reviews.
          </p>
          <div className="mt-8 grid md:grid-cols-4 gap-4">
            {[
              { quote: "Every detail whispers quality. The Vital Hoodie feels like a piece I'll wear for a decade.", author: "Amara O.", location: "London" },
              { quote: "Saint Vital redefines what modern fashion should feel like. Effortless, impeccable.", author: "Kenji T.", location: "Tokyo" },
              { quote: "The quality is unmatched. My go-to for timeless pieces that actually last.", author: "Elena V.", location: "Milan" },
              { quote: "Finally a brand that cares about fit, fabric, and finish. Worth every penny.", author: "Marcus J.", location: "New York" },
            ].map((r) => (
              <div key={r.author} className="card-lux p-5">
                <div className="flex items-center gap-0.5 text-[color:var(--gold)]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed">&ldquo;{r.quote}&rdquo;</p>
                <p className="mt-4 text-xs font-semibold">
                  {r.author}{" "}
                  <span className="text-muted-foreground font-normal">
                    · {r.location}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container-lux py-16">
        <div className="rounded-2xl bg-card border border-border p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-foreground">
              Get 10% off your first order
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              Sign up for early access to drops and exclusive offers.
            </p>
          </div>
          <form className="flex w-full md:w-auto max-w-md rounded-lg border border-border overflow-hidden">
            <input
              type="email"
              placeholder="you@email.com"
              className="flex-1 bg-background px-4 py-3 text-sm outline-none text-foreground placeholder:text-muted-foreground"
            />
            <button className="bg-[color:var(--gold)] text-[color:var(--ink)] px-5 text-sm font-bold">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </PageShell>
  );
}
