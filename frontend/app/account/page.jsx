import Link from "next/link";
import { PageShell, PageHero } from "@/components/site/PageShell";
import {
  Package,
  Heart,
  MapPin,
  CreditCard,
  Bell,
  Settings,
  LogOut,
  Check,
  Clock,
} from "lucide-react";

const orders = [
  {
    id: "SV-284910",
    date: "Mar 12, 2026",
    total: 261,
    status: "Delivered",
    items: 2,
  },
  {
    id: "SV-282104",
    date: "Feb 28, 2026",
    total: 890,
    status: "Shipping",
    items: 1,
  },
  {
    id: "SV-278621",
    date: "Feb 04, 2026",
    total: 420,
    status: "Processing",
    items: 1,
  },
];

const timeline = [
  "Confirmed",
  "Processing",
  "Printing",
  "Shipping",
  "Out for Delivery",
  "Delivered",
];

export default function Account() {
  return (
    <PageShell>
      <PageHero eyebrow="Client Portal" title="Your Account" />
      <section className="container-lux pb-24 grid lg:grid-cols-[240px_1fr] gap-12">
        <aside className="space-y-1">
          {[
            [Package, "Orders"],
            [Heart, "Wishlist"],
            [MapPin, "Addresses"],
            [CreditCard, "Payment"],
            [Bell, "Notifications"],
            [Settings, "Settings"],
            [LogOut, "Logout"],
          ].map(([Icon, label], i) => {
            const I = Icon;
            return (
              <button
                key={label}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition ${i === 0 ? "bg-[color:var(--card)] text-[color:var(--gold)]" : "text-muted-foreground hover:text-foreground"}`}
              >
                <I className="h-4 w-4" /> {label}
              </button>
            );
          })}
        </aside>

        <div>
          <h2 className="font-display text-3xl mb-8">Recent Orders</h2>
          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o.id} className="card-lux p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-eyebrow">Order #{o.id}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {o.date} · {o.items} items
                    </p>
                  </div>
                  <p className="font-display text-lg text-[color:var(--gold)]">
                    ${o.total}
                  </p>
                  <span
                    className={`text-xs tracking-[0.2em] uppercase px-3 py-1 border ${o.status === "Delivered" ? "border-[color:var(--gold)] text-[color:var(--gold)]" : "border-border text-muted-foreground"}`}
                  >
                    {o.status}
                  </span>
                </div>
                {o.status !== "Delivered" && (
                  <div className="mt-6 flex items-center justify-between">
                    {timeline.map((t, i) => {
                      const currentIdx = o.status === "Shipping" ? 3 : 1;
                      const done = i <= currentIdx;
                      return (
                        <div key={t} className="flex-1 flex items-center">
                          <div
                            className={`h-6 w-6 rounded-full flex items-center justify-center border ${done ? "border-[color:var(--gold)] bg-[color:var(--gold)] text-[color:var(--ink)]" : "border-border"}`}
                          >
                            {done ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <Clock className="h-3 w-3 text-muted-foreground" />
                            )}
                          </div>
                          {i < timeline.length - 1 && (
                            <div
                              className={`flex-1 h-px mx-1 ${i < currentIdx ? "bg-[color:var(--gold)]" : "bg-border"}`}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/order/success" className="btn-outline-gold">
              View All Orders
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
