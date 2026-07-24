
import Image from "next/image";
import { PageShell, PageHero } from "@/components/site/PageShell";

const timeline = [
  ["MMXXVI", "Saint Vital founded in Paris. First collection released."],
  ["MMXXVII", "Flagship studio opens. Direct-to-consumer launches."],
  ["MMXXVIII", "Expanded collection debuts. Global shipping goes live."],
];

export default function About() {
  return (
    <PageShell>
      <PageHero
        eyebrow="The Maison"
        title="Our Legacy"
        subtitle="Saint Vital was founded on a quiet conviction: that luxury today should be intimate, considered, and made to last."
      />

      <section className="container-lux pb-24 grid md:grid-cols-2 gap-16 items-center">
        <div className="product-image aspect-[4/5]">
          <Image src="/assets/hero-model.jpg" alt="Saint Vital atelier" fill className="object-cover" />
        </div>
        <div>
          <p className="text-eyebrow">Our Mission</p>
          <h2 className="mt-4 font-display text-4xl">Craft, considered.</h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            We design pieces for people who move through the world with
            intention. Every garment reflects a commitment to material honesty,
            editorial restraint, and the quiet confidence of true craftsmanship.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            We produce on demand. We choose ateliers who share our standards. We
            refuse trends in favor of legacy.
          </p>
        </div>
      </section>

      <section className="container-lux pb-24">
        <div className="text-center mb-16">
          <p className="text-eyebrow">Timeline</p>
          <h2 className="mt-4 font-display text-4xl">Our Story</h2>
        </div>
        <div className="max-w-2xl mx-auto space-y-12 border-l border-[color:var(--gold)] pl-8">
          {timeline.map(([year, event]) => (
            <div key={year} className="relative">
              <span className="absolute -left-[38px] top-1 h-3 w-3 rounded-full bg-[color:var(--gold)]" />
              <p className="font-display text-2xl text-[color:var(--gold)]">
                {year}
              </p>
              <p className="mt-2 text-muted-foreground">{event}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-lux pb-24 grid md:grid-cols-3 gap-6">
        {[
          ["Craft", "Every seam and stitch is intentional."],
          ["Restraint", "We remove until only essence remains."],
          ["Legacy", "Made to be worn for decades."],
        ].map(([t, d]) => (
          <div key={t} className="card-lux p-8">
            <p className="text-eyebrow">Value</p>
            <h3 className="mt-4 font-display text-2xl">{t}</h3>
            <p className="mt-3 text-muted-foreground text-sm">{d}</p>
          </div>
        ))}
      </section>
    </PageShell>
  );

}
