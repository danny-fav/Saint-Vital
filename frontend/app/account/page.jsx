"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { PageShell, PageHero } from "@/components/site/PageShell";
import { useAuth } from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useOrders";
import { useWishlist } from "@/hooks/useWishlist";
import { authService } from "@/services/auth";
import {
  Package,
  Heart,
  MapPin,
  Bell,
  Settings,
  LogOut,
  Check,
  Clock,
  Loader2,
  CreditCard,
  AlertTriangle,
} from "lucide-react";

const statusSteps = ["pending", "paid", "processing", "fulfilled", "shipped", "delivered"];

const statusLabel = {
  pending: "Pending",
  paid: "Paid",
  processing: "Processing",
  fulfilled: "Fulfilled",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatCurrency(amount) {
  const num = Number(amount);
  if (isNaN(num)) return amount;
  return num.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function OrderCard({ order }) {
  const currentIdx = statusSteps.indexOf(order.status);

  const isDelivered = order.status === "delivered";
  const isCancelled = order.status === "cancelled" || order.status === "refunded";

  return (
    <div className="card-lux p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-eyebrow">Order #{order.order_number || order.id}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatDate(order.created_at)} &middot; {order.item_count} item{order.item_count !== 1 ? "s" : ""}
          </p>
        </div>
        <p className="font-display text-lg text-[color:var(--gold)]">
          {formatCurrency(order.total)}
        </p>
        <span
          className={`text-xs tracking-[0.2em] uppercase px-3 py-1 border ${
            isDelivered
              ? "border-[color:var(--gold)] text-[color:var(--gold)]"
              : isCancelled
                ? "border-red-500 text-red-500"
                : "border-border text-muted-foreground"
          }`}
        >
          {statusLabel[order.status] || order.status}
        </span>
      </div>
      {!isDelivered && !isCancelled && currentIdx >= 0 && (
        <div className="mt-6 flex items-center justify-between">
          {statusSteps.map((step, i) => {
            const done = i <= currentIdx;
            return (
              <div key={step} className="flex-1 flex items-center">
                <div
                  className={`h-6 w-6 rounded-full flex items-center justify-center border ${
                    done
                      ? "border-[color:var(--gold)] bg-[color:var(--gold)] text-[color:var(--ink)]"
                      : "border-border"
                  }`}
                >
                  {done ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Clock className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>
                {i < statusSteps.length - 1 && (
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
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="card-lux p-6 animate-pulse">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-[color:var(--border)] rounded" />
              <div className="h-3 w-24 bg-[color:var(--border)] rounded" />
            </div>
            <div className="h-6 w-20 bg-[color:var(--border)] rounded" />
            <div className="h-5 w-24 bg-[color:var(--border)] rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function LogoutConfirmDialog({ open, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="card-lux p-8 max-w-sm mx-4 text-center animate-lux-fade">
        <AlertTriangle className="h-10 w-10 mx-auto text-destructive" />
        <p className="mt-4 font-display text-xl">Sign Out</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Are you sure you want to sign out?
        </p>
        <div className="mt-6 flex gap-3 justify-center">
          <button onClick={onCancel} className="btn-outline-gold">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn-gold btn-gold-hover">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

const sidebarItems = [
  { icon: Package, label: "Orders", key: "orders" },
  { icon: Heart, label: "Wishlist", key: "wishlist", href: "/wishlist" },
  { icon: MapPin, label: "Addresses", key: "addresses" },
  { icon: CreditCard, label: "Payment", key: "payment" },
  { icon: Bell, label: "Notifications", key: "notifications" },
  { icon: Settings, label: "Settings", key: "settings" },
  { icon: LogOut, label: "Logout", key: "logout" },
];

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, logout } = useAuth();
  const { data: ordersData, isPending: ordersLoading } = useOrders();
  const { wishlist } = useWishlist();
  const [activeSection, setActiveSection] = useState("orders");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth?redirect=/account");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["orders", "addresses", "payment", "notifications", "settings"].includes(tab)) {
      setActiveSection(tab);
    }
  }, [searchParams]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const orders = ordersData?.results ?? [];
  const wishlistCount = wishlist?.items?.length ?? 0;

  const {
    data: addresses,
    isPending: addressesLoading,
    error: addressesError,
  } = useQuery({
    queryKey: ["addresses"],
    queryFn: () => authService.getAddresses().then((r) => r.data?.results ?? r.data ?? []),
    enabled: activeSection === "addresses",
  });

  const handleSidebarClick = (item) => {
    if (item.href) return;
    if (item.key === "logout") {
      setShowLogoutConfirm(true);
      return;
    }
    setActiveSection(item.key);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", item.key);
    router.replace(`/account?${params.toString()}`, { scroll: false });
  };

  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(false);
    logout();
    router.push("/");
  };

  return (
    <PageShell>
      <PageHero eyebrow="Client Portal" title="Your Account" />
      <section className="container-lux pb-24 grid lg:grid-cols-[240px_1fr] gap-12">
        <aside className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = !item.href && activeSection === item.key;
            const isWishlist = item.key === "wishlist";

            if (item.href) {
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition text-muted-foreground hover:text-foreground`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                  {isWishlist && wishlistCount > 0 && (
                    <span className="ml-auto text-xs bg-[color:var(--gold)] text-[color:var(--ink)] rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              );
            }

            return (
              <button
                key={item.key}
                onClick={() => handleSidebarClick(item)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition ${
                  isActive
                    ? "bg-[color:var(--card)] text-[color:var(--gold)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" /> {item.label}
              </button>
            );
          })}
        </aside>

        <div>
          {activeSection === "orders" && (
            <>
              <h2 className="font-display text-3xl mb-8">Recent Orders</h2>
              {ordersLoading ? (
                <LoadingSkeleton />
              ) : orders.length === 0 ? (
                <div className="text-center py-16">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">No orders yet.</p>
                  <Link href="/shop" className="btn-outline-gold mt-6 inline-flex">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                  </div>
                  <div className="mt-12 text-center">
                    <Link href="/order/success" className="btn-outline-gold">
                      View All Orders
                    </Link>
                  </div>
                </>
              )}
            </>
          )}

          {activeSection === "addresses" && (
            <>
              <h2 className="font-display text-3xl mb-8">Addresses</h2>
              {addressesLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-16">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">No addresses saved yet.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="card-lux p-6">
                      <p className="font-semibold">{addr.label || "Address"}</p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {addr.street_address}
                        {addr.apartment && `, ${addr.apartment}`}
                        <br />
                        {addr.city}, {addr.state} {addr.postal_code}
                        <br />
                        {addr.country}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeSection === "payment" && (
            <div className="text-center py-16">
              <CreditCard className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">Payment methods coming soon.</p>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="text-center py-16">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">No notifications yet.</p>
            </div>
          )}

          {activeSection === "settings" && (
            <>
              <h2 className="font-display text-3xl mb-8">Settings</h2>
              <div className="card-lux p-6 space-y-4">
                <div>
                  <p className="text-eyeblock text-sm text-muted-foreground">Name</p>
                  <p className="mt-1">{user?.first_name} {user?.last_name}</p>
                </div>
                <div>
                  <p className="text-eyeblock text-sm text-muted-foreground">Email</p>
                  <p className="mt-1">{user?.email}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <LogoutConfirmDialog
        open={showLogoutConfirm}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </PageShell>
  );
}

export default function Account() {
  return (
    <Suspense fallback={
      <PageShell>
        <PageHero eyebrow="Client Portal" title="Your Account" />
        <section className="container-lux pb-24 flex items-center justify-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[color:var(--gold)] border-t-transparent" />
        </section>
      </PageShell>
    }>
      <AccountContent />
    </Suspense>
  );
}