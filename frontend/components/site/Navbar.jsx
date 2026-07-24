"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  LogIn,
  UserPlus,
  LayoutDashboard,
} from "lucide-react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";
import { useAuth } from "@/hooks/useAuth";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const q = searchQuery.trim();
      if (q) {
        router.push(`/shop?search=${encodeURIComponent(q)}`);
        setSearchOpen(false);
        setSearchQuery("");
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, router]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
      e.target.blur();
    }
    if (e.key === "Escape") {
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const isAdmin = user?.role === "admin";

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const navLinkClass = (href) =>
    `text-sm font-medium transition-colors relative py-1 ${
      isActive(href)
        ? "text-foreground"
        : "text-foreground/70 hover:text-foreground"
    }`;

  const iconBtnClass =
    "h-9 w-9 rounded-lg flex items-center justify-center hover:bg-[color:var(--surface)] transition-colors text-foreground/80 hover:text-foreground";

  return (
    <header
      className={`sticky top-0 z-50 bg-background/95 backdrop-blur-md transition-shadow ${
        scrolled
          ? "shadow-[0_1px_0_0_var(--color-border)]"
          : "border-b border-border"
      }`}
    >
      <div className="container-lux flex items-center gap-4 py-3">
        <button
          className="md:hidden text-foreground/80 hover:text-foreground"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Logo compact />

        <nav className="hidden md:flex items-center gap-6 ml-6">
          {publicLinks.map((l) => (
            <Link key={l.href} href={l.href} className={navLinkClass(l.href)}>
              {l.label}
              {isActive(l.href) && !scrolled && (
                <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-[color:var(--gold)]" />
              )}
              {isActive(l.href) && scrolled && (
                <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-[color:var(--gold)]" />
              )}
            </Link>
          ))}
          {isAdmin && (
            <Link href="/admin" className={navLinkClass("/admin")}>
              <span className="flex items-center gap-1.5">
                <LayoutDashboard className="h-3.5 w-3.5" />
                Admin
              </span>
              {isActive("/admin") && (
                <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-[color:var(--gold)]" />
              )}
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-1 ml-auto">
          {searchOpen ? (
            <div className="flex items-center bg-[color:var(--surface)] rounded-lg border border-border focus-within:border-foreground/40 transition flex-1 max-w-xs">
              <Search className="h-4 w-4 text-muted-foreground ml-3 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search products…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="flex-1 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground min-w-0"
              />
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
                className="mr-1 p-1.5 text-muted-foreground hover:text-foreground rounded"
                aria-label="Close search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className={iconBtnClass}
              aria-label="Search"
            >
              <Search className="h-4.5 w-4.5" />
            </button>
          )}

          <ThemeToggle />

          <Link href="/wishlist" className={iconBtnClass} aria-label="Wishlist">
            <Heart className="h-4.5 w-4.5" />
          </Link>

          <Link href="/cart" className={iconBtnClass} aria-label="Cart">
            <ShoppingBag className="h-4.5 w-4.5" />
          </Link>

          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <div className="hidden sm:flex items-center gap-2 ml-2">
              <Link
                href="/auth"
                className="btn-outline-gold text-xs px-4 py-2"
              >
                <LogIn className="h-3.5 w-3.5" />
                Sign In
              </Link>
              <Link
                href="/auth?mode=signup"
                className="btn-gold btn-gold-hover text-xs px-4 py-2"
              >
                <UserPlus className="h-3.5 w-3.5" />
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-background md:hidden animate-lux-fade">
          <div className="flex items-center justify-between container-lux py-4 border-b border-border">
            <Logo compact />
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="container-lux mt-2 flex flex-col">
            {publicLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className={`border-b border-border py-4 text-lg font-semibold transition-colors ${
                  isActive(l.href)
                    ? "text-foreground"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}

            {isAuthenticated && (
              <>
                <Link
                  href="/account"
                  onClick={() => setMobileOpen(false)}
                  className="border-b border-border py-4 text-lg font-semibold"
                >
                  Account
                </Link>
                <Link
                  href="/account/orders"
                  onClick={() => setMobileOpen(false)}
                  className="border-b border-border py-4 text-lg font-semibold"
                >
                  Orders
                </Link>
                <Link
                  href="/wishlist"
                  onClick={() => setMobileOpen(false)}
                  className="border-b border-border py-4 text-lg font-semibold"
                >
                  Wishlist
                </Link>
              </>
            )}

            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="border-b border-border py-4 text-lg font-semibold text-[color:var(--gold)]"
              >
                Admin Dashboard
              </Link>
            )}

            {!isAuthenticated && (
              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="btn-gold btn-gold-hover w-full justify-center"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Link>
                <Link
                  href="/auth?mode=signup"
                  onClick={() => setMobileOpen(false)}
                  className="btn-outline-gold w-full justify-center"
                >
                  <UserPlus className="h-4 w-4" />
                  Create Account
                </Link>
              </div>
            )}

            {isAuthenticated && (
              <button
                onClick={async () => {
                  setMobileOpen(false);
                  await logout();
                  router.push("/");
                }}
                className="mt-6 py-4 text-left text-lg font-semibold text-muted-foreground hover:text-destructive transition-colors"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
