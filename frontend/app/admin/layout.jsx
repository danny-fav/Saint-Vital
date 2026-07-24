"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminGuard } from "@/components/admin/AdminGuard";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  TicketPercent,
  Settings,
  ArrowLeft,
} from "lucide-react";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/coupons", label: "Coupons", icon: TicketPercent },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-background">
        <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-[color:var(--surface)] p-6">
          <Link href="/" className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Store
          </Link>
          <p className="text-xs tracking-[0.24em] uppercase text-muted-foreground mb-4">Admin</p>
          <nav className="flex flex-col gap-1">
            {adminLinks.map(({ href, label, icon: Icon }) => {
              const isActive = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition ${
                    isActive
                      ? "bg-[color:var(--gold)]/10 text-[color:var(--gold)]"
                      : "text-muted-foreground hover:text-foreground hover:bg-[color:var(--border)]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="lg:hidden border-b border-border px-4 py-3 flex items-center gap-2">
            <Link href="/" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" />
              Store
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-xs font-medium">Admin</span>
          </div>
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
