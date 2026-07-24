"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/orders";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

function formatCurrency(amount) {
  const num = Number(amount);
  if (isNaN(num)) return amount;
  return num.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function AdminOrders() {
  const [page, setPage] = useState(1);

  const { data, isPending } = useQuery({
    queryKey: ["admin", "orders", page],
    queryFn: () => orderService.list({ page }).then((r) => r.data),
  });

  const orders = data?.results ?? [];

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">Orders</h1>
        <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase">
          {data?.count ?? 0} total
        </p>
      </div>

      <div className="card-lux overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs tracking-[0.2em] uppercase text-muted-foreground">
                <th className="text-left p-4 font-medium">Order</th>
                <th className="text-left p-4 font-medium">Customer</th>
                <th className="text-left p-4 font-medium">Date</th>
                <th className="text-right p-4 font-medium">Total</th>
                <th className="text-right p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {isPending ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-muted-foreground text-xs">
                    No orders yet.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0">
                    <td className="p-4 font-medium">#{order.order_number || order.id}</td>
                    <td className="p-4 text-muted-foreground">{order.customer_email || "—"}</td>
                    <td className="p-4 text-muted-foreground">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString() : "—"}
                    </td>
                    <td className="p-4 text-right">{formatCurrency(order.total)}</td>
                    <td className="p-4 text-right">
                      <span className="text-xs text-[color:var(--gold)] tracking-[0.2em] uppercase">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {data && data.count > 24 && (
        <div className="flex items-center justify-center gap-6 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!data.previous}
            className="flex items-center gap-1 text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition disabled:opacity-30"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Prev
          </button>
          <span className="text-xs text-muted-foreground">Page {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!data.next}
            className="flex items-center gap-1 text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition disabled:opacity-30"
          >
            Next <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
