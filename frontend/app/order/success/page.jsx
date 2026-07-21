import Link from "next/link";
import { PageShell } from "@/components/site/PageShell";
import { CheckCircle, Package, ArrowRight } from "lucide-react";

export default function OrderSuccessPage() {
  return (
    <PageShell>
      <section className="container-lux py-24 text-center">
        <div className="max-w-md mx-auto">
          <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
          <h1 className="mt-8 font-display text-3xl md:text-4xl font-extrabold">
            Order Confirmed
          </h1>
          <p className="mt-4 text-muted-foreground">
            Thank you for your order! You&apos;ll receive a confirmation email
            with your order details and tracking information.
          </p>
          <div className="mt-8 p-6 rounded-xl bg-[color:var(--surface)] text-left">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-[color:var(--gold)]" />
              <p className="font-semibold text-sm">Order #SV-2026-4281</p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Estimated delivery: 5-10 business days
            </p>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/account" className="btn-primary">
              View Order <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/shop" className="btn-ghost-outline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
