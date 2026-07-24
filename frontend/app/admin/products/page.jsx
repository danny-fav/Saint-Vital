"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useProducts } from "@/hooks/useProducts";
import { Loader2, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";

function formatCurrency(amount) {
  const num = Number(amount);
  if (isNaN(num)) return amount;
  return num.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function AdminProducts() {
  const [page, setPage] = useState(1);

  const { data, isPending } = useProducts({ page, page_size: 25 });

  const products = data?.results ?? [];

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">Products</h1>
        <Link href="/admin/products/new" className="btn-gold btn-gold-hover text-xs inline-flex items-center gap-2">
          <Plus className="h-3.5 w-3.5" /> Add Product
        </Link>
      </div>

      <div className="card-lux overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs tracking-[0.2em] uppercase text-muted-foreground">
                <th className="text-left p-4 font-medium">Name</th>
                <th className="text-left p-4 font-medium">SKU</th>
                <th className="text-left p-4 font-medium">Category</th>
                <th className="text-right p-4 font-medium">Price</th>
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
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-muted-foreground text-xs">
                    No products yet.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-b border-border last:border-0">
                    <td className="p-4 font-medium">{product.name}</td>
                    <td className="p-4 text-muted-foreground">{product.sku || "—"}</td>
                    <td className="p-4 text-muted-foreground">{product.category?.name || "—"}</td>
                    <td className="p-4 text-right">{formatCurrency(product.price)}</td>
                    <td className="p-4 text-right">
                      <span className={`text-xs tracking-[0.2em] uppercase ${product.status === "active" ? "text-green-600" : "text-muted-foreground"}`}>
                        {product.status}
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
