"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Package,
  Heart,
  MapPin,
  Settings,
  Palette,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "./ThemeToggle";

const menuItems = [
  { href: "/account", label: "My Profile", icon: User },
  { href: "/account?tab=orders", label: "My Orders", icon: Package },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account?tab=addresses", label: "Addresses", icon: MapPin },
  { href: "/account?tab=settings", label: "Settings", icon: Settings },
];

export function UserMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) {
      document.addEventListener("mousedown", handleClick);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const initials = user
    ? `${user.first_name?.charAt(0) || ""}${user.last_name?.charAt(0) || ""}`.toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"
    : "U";

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    router.push("/");
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[color:var(--surface)] transition-colors"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Account menu"
      >
        <span className="h-8 w-8 rounded-full bg-[color:var(--gold)] text-[color:var(--ink)] flex items-center justify-center text-xs font-semibold select-none">
          {initials}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-background shadow-xl shadow-black/5 animate-lux-fade overflow-hidden"
          role="menu"
        >
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-medium truncate">
              {user?.first_name
                ? `${user.first_name} ${user.last_name || ""}`.trim()
                : user?.email || "User"}
            </p>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {user?.email || ""}
            </p>
          </div>

          <div className="py-1">
            {menuItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/80 hover:text-foreground hover:bg-[color:var(--surface)] transition-colors"
                role="menuitem"
              >
                <Icon className="h-4 w-4 text-muted-foreground" />
                {label}
              </Link>
            ))}
          </div>

          <div className="border-t border-border py-1">
            <div className="flex items-center justify-between px-4 py-2.5 text-sm text-foreground/80">
              <span className="flex items-center gap-3">
                <Palette className="h-4 w-4 text-muted-foreground" />
                Theme
              </span>
              <ThemeToggle />
            </div>
          </div>

          <div className="border-t border-border py-1">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground/80 hover:text-destructive hover:bg-[color:var(--surface)] transition-colors"
              role="menuitem"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
