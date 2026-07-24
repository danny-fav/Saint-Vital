"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";

function formatCurrency(amount) {
  const num = Number(amount);
  if (isNaN(num)) return amount;
  return num.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function AdminCoupons() {
  const [page, setPage] = useState(1);

  const { data, isPending } = useQuery({
    queryKey: ["admin", "coupons", page],
    queryFn: () => api.get(`/coupons/?page=${page}`).then((r) => r.data),
  });

  const coupons = data?.results ?? [];

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">Coupons</h1>
        <Link href="/admin/coupons/new" className="btn-gold btn-gold-hover text-xs inline-flex items-center gap-2">
          <Plus className="h-3.5 w-3.5" /> Add Coupon
        </Link>
      </div>

      <div className="card-lux overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs tracking-[0.2em] uppercase text-muted-foreground">
                <th className="text-left p-4 font-medium">Code</th>
                <th className="text-left p-4 font-medium">Discount</th>
                <th className="text-left p-4 font-medium">Type</th>
                <th className="text-left p-4 font-medium">Expires</th>
                <th className="text-right p-4 font-medium">Uses</th>
              </tr>
            </thead>
            <tbody>
              {isPending ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-muted-foreground text-xs">
                    No coupons yet.
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon.id} className="border-b border-border last:border-0">
                    <td className="p-4 font-medium uppercase">{coupon.code}</td>
                    <td className="p-4 text-muted-foreground">
                      {coupon.discount_type === "percentage"
                        ? `${coupon.discount_value}%`
                        : formatCurrency(coupon.discount_value)}
                    </td>
                    <td className="p-4 text-muted-foreground">{coupon.discount_type}</td>
                    <td className="p-4 text-muted-foreground">
                      {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : "Never"}
                    </td>
                    <td className="p-4 text-right">{coupon.used_count ?? 0}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
