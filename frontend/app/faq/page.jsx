import Link from "next/link";
import { PageShell, PageHero } from "@/components/site/PageShell";
import { ChevronDown, Search } from "lucide-react";

const faqs = [
  {
    q: "What is Saint Vital?",
    a: "Saint Vital is a modern clothing brand focused on premium essentials. We design and produce quality garments that are built to last.",
  },
  {
    q: "Where are your products made?",
    a: "Our products are ethically manufactured in Portugal and the USA using premium materials sourced from around the world.",
  },
  {
    q: "How do I find my size?",
    a: "Refer to our size guide on each product page. If you're between sizes, we recommend sizing up for a relaxed fit.",
  },
  {
    q: "How long does shipping take?",
    a: "Domestic orders typically arrive within 5-10 business days. International orders may take 10-20 business days depending on customs.",
  },
  {
    q: "What is your return policy?",
    a: "We accept returns within 30 days of delivery. Items must be unworn with tags attached. See our returns page for details.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes, we ship worldwide. International shipping rates and times vary by destination.",
  },
  {
    q: "Can I change or cancel my order?",
    a: "Orders can be modified within 1 hour of placement. Contact us immediately if you need to make changes.",
  },
  {
    q: "How do I care for my garments?",
    a: "Each product includes care instructions. Generally, we recommend cold wash and air dry to extend the life of your pieces.",
  },
  {
    q: "Do you offer gift wrapping?",
    a: "Yes, all orders are packaged in our signature box with tissue paper. Gift messages can be added at checkout.",
  },
  {
    q: "How can I contact support?",
    a: "Reach us via our contact page or email us at support@saintvital.com. We typically respond within 24 hours.",
  },
];

export default function FAQPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Help"
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about Saint Vital."
      />
      <section className="container-lux pb-24 max-w-3xl mx-auto">
        <div className="space-y-0 divide-y divide-border">
          {faqs.map((faq) => (
            <details key={faq.q} className="group py-6">
              <summary className="flex items-center justify-between cursor-pointer font-semibold text-foreground">
                {faq.q}
                <ChevronDown className="h-4 w-4 text-muted-foreground group-open:rotate-180 transition-transform" />
              </summary>
              <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Still have questions?
          </p>
          <Link href="/contact" className="btn-primary mt-4 inline-flex">
            Contact Us
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
