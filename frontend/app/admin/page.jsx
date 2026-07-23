"use client";

import { PageShell, PageHero } from "@/components/site/PageShell";
import {
  ShoppingBag,
  DollarSign,
  Package,
  Users,
  TrendingUp,
} from "lucide-react";

export default function Admin() {
  return (
    <PageShell>
      <PageHero eyebrow="Operations" title="Admin Console" />
      <section className="container-lux pb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            [ShoppingBag, "3,241", "Orders"],
            [DollarSign, "$482k", "Revenue"],
            [Package, "1,892", "Fulfilled"],
            [Users, "12,480", "Customers"],
          ].map(([Icon, val, label]) => {
            const I = Icon;
            return (
              <div key={label} className="card-lux p-6">
                <I className="h-5 w-5 text-[color:var(--gold)]" />
                <p className="mt-6 font-display text-3xl">{val}</p>
                <p className="mt-1 text-xs tracking-[0.24em] uppercase text-muted-foreground">
                  {label}
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="card-lux p-8">
            <h3 className="font-display text-2xl mb-6">Recent Orders</h3>
            <div className="space-y-4">
              {[
                ["#SV-2841", "Vital Hoodie", "$189", "Processing"],
                ["#SV-2840", "Legacy Tee + Cap", "$140", "Shipped"],
                ["#SV-2839", "Sovereign Bomber", "$420", "Delivered"],
              ].map(([id, product, total, status]) => (
                <div
                  key={id}
                  className="flex items-center justify-between border-b border-border pb-4"
                >
                  <div>
                    <p className="font-semibold text-sm">{id}</p>
                    <p className="text-xs text-muted-foreground">{product}</p>
                  </div>
                  <p className="text-sm font-medium">{total}</p>
                  <span className="text-xs text-[color:var(--gold)] tracking-[0.2em] uppercase">
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card-lux p-8">
            <h3 className="font-display text-2xl mb-6 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[color:var(--gold)]" />
              Overview
            </h3>
            <div className="space-y-4">
              {[
                ["Conversion Rate", "3.2%", "+0.4%"],
                ["Avg. Order Value", "$128", "+$12"],
                ["Return Rate", "4.1%", "-0.8%"],
              ].map(([metric, value, change]) => (
                <div
                  key={metric}
                  className="flex items-center justify-between text-sm border-b border-border pb-3"
                >
                  <span className="text-muted-foreground">{metric}</span>
                  <span className="font-semibold">{value}</span>
                  <span className="text-xs text-[color:var(--gold)]">{change}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
