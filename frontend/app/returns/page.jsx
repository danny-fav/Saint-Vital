import Link from "next/link";
import { PageShell, PageHero } from "@/components/site/PageShell";
import { RotateCcw, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";

const steps = [
  {
    icon: CheckCircle,
    title: "Eligibility",
    desc: "Items must be returned within 30 days of delivery. Products must be unworn, unwashed, and with all tags attached.",
  },
  {
    icon: RotateCcw,
    title: "How to Return",
    desc: "Contact us to initiate a return. We'll provide a prepaid return label. The cost of return shipping will be deducted from your refund.",
  },
  {
    icon: AlertCircle,
    title: "Exceptions",
    desc: "Sale items, underwear, and face masks are final sale and cannot be returned. Damaged or defective items are always eligible.",
  },
  {
    icon: CheckCircle,
    title: "Refunds",
    desc: "Refunds are processed within 5-7 business days after we receive your return. Funds are returned to the original payment method.",
  },
];

export default function ReturnsPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Policy"
        title="Returns & Exchanges"
        subtitle="Hassle-free returns within 30 days."
      />
      <section className="container-lux pb-24 max-w-3xl mx-auto">
        <div className="space-y-8">
          {steps.map((item) => {
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
        <div className="mt-12 text-center">
          <Link href="/contact" className="btn-primary inline-flex">
            Start a Return
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
