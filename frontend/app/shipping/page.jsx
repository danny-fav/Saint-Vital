import Link from "next/link";
import { PageShell, PageHero } from "@/components/site/PageShell";
import { Truck, Package, Clock, Globe, CreditCard } from "lucide-react";

const shippingInfo = [
  {
    icon: Package,
    title: "Order Processing",
    desc: "Orders are processed within 1-2 business days. You will receive a confirmation email once your order ships.",
  },
  {
    icon: Truck,
    title: "Domestic Shipping",
    desc: "Standard shipping (5-10 business days): $5.99. Free on orders over $150. Express shipping (2-3 business days): $14.99.",
  },
  {
    icon: Globe,
    title: "International Shipping",
    desc: "International shipping rates vary by destination. Delivery typically takes 10-20 business days. Duties and taxes may apply.",
  },
  {
    icon: Clock,
    title: "Delivery Times",
    desc: "Delivery times are estimates and not guaranteed. We are not responsible for delays caused by customs or carriers.",
  },
  {
    icon: CreditCard,
    title: "Payment Methods",
    desc: "We accept Visa, Mastercard, American Express, PayPal, and Apple Pay. All transactions are secure and encrypted.",
  },
];

export default function ShippingPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Policy"
        title="Shipping Information"
        subtitle="Everything you need to know about delivery."
      />
      <section className="container-lux pb-24 max-w-3xl mx-auto">
        <div className="space-y-8">
          {shippingInfo.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="card-lux p-6 flex gap-5">
                <div className="mt-1">
                  <Icon className="h-5 w-5 text-[color:var(--gold)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-12 p-6 rounded-xl bg-[color:var(--surface)] text-center">
          <p className="text-sm text-muted-foreground">
            Questions about shipping? <Link href="/contact" className="text-[color:var(--gold)] hover:underline">Contact us</Link>
          </p>
        </div>
      </section>
    </PageShell>
  );
}
