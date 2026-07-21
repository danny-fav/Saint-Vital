
import { PageShell, PageHero } from "@/components/site/PageShell";
import { ProductCard } from "@/components/site/ProductCard";
import { products } from "@/lib/data";



const collections = [
  {
    name: "Autumn MMXXVI",
    description:
      "The house collection. Sculpted silhouettes in obsidian and camel.",
  },
  {
    name: "Noir Essentials",
    description: "Foundational pieces. Made only when ordered.",
  },
  {
    name: "Gilded Editions",
    description: "Limited drops with 18k gold-tone hardware.",
  },
];

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
          <div key={c.name}>
            <div className="text-center mb-12">
              <p className="text-eyebrow">
                Édition {String(idx + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-4 font-display text-4xl md:text-5xl">
                {c.name}
              </h2>
              <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
                {c.description}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products
                .slice(idx, idx + 4)
                .concat(products)
                .slice(0, 4)
                .map((p) => (
                  <ProductCard key={c.name + p.id} product={p} />
                ))}
            </div>
          </div>
        ))}
      </section>
    </PageShell>
  );

}
