"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { analyticsService } from "@/services/analytics";
import { orderService } from "@/services/orders";
import {
  ShoppingBag,
  DollarSign,
  Package,
  Users,
  TrendingUp,
} from "lucide-react";

function formatCurrency(amount) {
  const num = Number(amount);
  if (isNaN(num)) return amount;
  return num.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function Admin() {
  const { user } = useAuth();

  const { data: dashboard, isPending: dashboardLoading } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () => analyticsService.dashboard().then((r) => r.data),
    enabled: !!user,
  });

  const { data: revenueData, isPending: revenueLoading } = useQuery({
    queryKey: ["admin", "revenue", 7],
    queryFn: () => analyticsService.revenue(7).then((r) => r.data),
    enabled: !!user,
  });

  const { data: ordersData, isPending: ordersLoading } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: () => orderService.list().then((r) => r.data),
    enabled: !!user,
  });

  const recentOrders = ordersData?.results ?? [];
  const stats = [
    { icon: ShoppingBag, value: dashboard?.total_orders ?? "...", label: "Orders" },
    { icon: DollarSign, value: dashboard?.total_revenue ? formatCurrency(dashboard.total_revenue) : "...", label: "Revenue" },
    { icon: Package, value: dashboard?.total_products ?? "...", label: "Products" },
    { icon: Users, value: dashboard?.total_customers ?? "...", label: "Customers" },
  ];

  const overviewMetrics = [
    { metric: "Conversion Rate", value: dashboard?.conversion_rate ? `${dashboard.conversion_rate}%` : "...", change: "" },
    { metric: "Avg. Order Value", value: dashboard?.average_order_value ? formatCurrency(dashboard.average_order_value) : "...", change: "" },
    { metric: "Revenue Today", value: dashboard?.revenue_today ? formatCurrency(dashboard.revenue_today) : "...", change: "" },
    { metric: "Orders Today", value: dashboard?.orders_today ?? "...", change: "" },
  ];

  return (
    <div className="p-6 lg:p-10">
      <h1 className="font-display text-3xl mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {stats.map(({ icon: Icon, value, label }) => (
          <div key={label} className="card-lux p-6">
            <Icon className="h-5 w-5 text-[color:var(--gold)]" />
            <p className="mt-6 font-display text-3xl">
              {dashboardLoading ? (
                <span className="inline-block h-8 w-20 bg-[color:var(--border)] rounded animate-pulse" />
              ) : (
                value
              )}
            </p>
            <p className="mt-1 text-xs tracking-[0.24em] uppercase text-muted-foreground">
              {label}
            </p>
          </div>
        ))}
      </div>

      <div className="card-lux p-8 mb-8">
        <h3 className="font-display text-2xl mb-6">Revenue (7 days)</h3>
        {revenueLoading ? (
          <div className="h-24 bg-[color:var(--border)] rounded animate-pulse" />
        ) : revenueData?.length > 0 ? (
          <div className="flex items-end gap-2 h-24">
            {revenueData.map((d) => {
              const max = Math.max(...revenueData.map((r) => Number(r.revenue)), 1);
              const height = (Number(d.revenue) / max) * 100;
              return (
                <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[0.55rem] text-muted-foreground">${Number(d.revenue).toFixed(0)}</span>
                  <div
                    className="w-full bg-[color:var(--gold)] rounded-t"
                    style={{ height: `${Math.max(height, 4)}%` }}
                  />
                  <span className="text-[0.5rem] text-muted-foreground">
                    {new Date(d.date).toLocaleDateString("en", { weekday: "short" })}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No revenue data yet.</p>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="card-lux p-8">
          <h3 className="font-display text-2xl mb-6">Recent Orders</h3>
          {ordersLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between border-b border-border pb-4 animate-pulse">
                  <div className="space-y-2">
                    <div className="h-4 w-28 bg-[color:var(--border)] rounded" />
                    <div className="h-3 w-20 bg-[color:var(--border)] rounded" />
                  </div>
                  <div className="h-4 w-16 bg-[color:var(--border)] rounded" />
                  <div className="h-4 w-20 bg-[color:var(--border)] rounded" />
                </div>
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <div className="space-y-4">
              {recentOrders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b border-border pb-4"
                >
                  <div>
                    <p className="font-semibold text-sm">
                      #{order.order_number || order.id}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.item_count} item{order.item_count !== 1 ? "s" : ""} &middot;{" "}
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm font-medium">
                    {formatCurrency(order.total)}
                  </p>
                  <span className="text-xs text-[color:var(--gold)] tracking-[0.2em] uppercase">
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card-lux p-8">
          <h3 className="font-display text-2xl mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[color:var(--gold)]" />
            Overview
          </h3>
          <div className="space-y-4">
            {overviewMetrics.map(({ metric, value, change }) => (
              <div
                key={metric}
                className="flex items-center justify-between text-sm border-b border-border pb-3"
              >
                <span className="text-muted-foreground">{metric}</span>
                <span className="font-semibold">
                  {dashboardLoading ? (
                    <span className="inline-block h-4 w-16 bg-[color:var(--border)] rounded animate-pulse" />
                  ) : (
                    value
                  )}
                </span>
                {change && (
                  <span className="text-xs text-[color:var(--gold)]">{change}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}