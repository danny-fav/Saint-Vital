"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-background/95 backdrop-blur-md transition-shadow ${
        scrolled ? "shadow-[0_1px_0_0_var(--color-border)]" : "border-b border-border"
      }`}
    >
      <div className="container-lux flex items-center gap-6 py-3.5">
        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Logo compact />

        <nav className="hidden md:flex items-center gap-7 ml-6 text-sm font-medium">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-foreground/80 hover:text-foreground transition-colors relative py-1"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex flex-1 max-w-md ml-4">
          <label className="flex items-center gap-2 w-full bg-[color:var(--surface)] rounded-lg px-3 py-2 border border-border focus-within:border-foreground/40 transition">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </label>
        </div>

        <div className="flex items-center gap-1 ml-auto text-foreground">
          <button
            aria-label="Search"
            className="md:hidden h-9 w-9 rounded-lg flex items-center justify-center hover:bg-[color:var(--surface)]"
          >
            <Search className="h-4.5 w-4.5" />
          </button>
          <ThemeToggle />
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="h-9 w-9 rounded-lg flex items-center justify-center hover:bg-[color:var(--surface)]"
          >
            <Heart className="h-4.5 w-4.5" />
          </Link>
          <Link
            href="/account"
            aria-label="Account"
            className="h-9 w-9 rounded-lg flex items-center justify-center hover:bg-[color:var(--surface)]"
          >
            <User className="h-4.5 w-4.5" />
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative h-9 w-9 rounded-lg flex items-center justify-center hover:bg-[color:var(--surface)]"
          >
            <ShoppingBag className="h-4.5 w-4.5" />
            <span className="absolute -top-0.5 -right-0.5 bg-[color:var(--gold)] text-[color:var(--ink)] text-[0.6rem] rounded-full h-4 min-w-4 px-1 flex items-center justify-center font-bold">
              2
            </span>
          </Link>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-background md:hidden animate-lux-fade">
          <div className="container-lux py-4 flex items-center justify-between border-b border-border">
            <Logo compact />
            <button onClick={() => setOpen(false)} aria-label="Close menu">
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="container-lux mt-4 flex flex-col">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-border py-4 text-lg font-semibold"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/shop"
              onClick={() => setOpen(false)}
              className="border-b border-border py-4 text-lg font-semibold"
            >
              Shop All
            </Link>
            <Link
              href="/wishlist"
              onClick={() => setOpen(false)}
              className="border-b border-border py-4 text-lg font-semibold"
            >
              Wishlist
            </Link>
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="border-b border-border py-4 text-lg font-semibold"
            >
              Account
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
