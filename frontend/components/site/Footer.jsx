import Link from "next/link";
import { Instagram, Facebook, Twitter } from "lucide-react";
import { Logo } from "./Logo";

const cols = [
  {
    title: "Shop",
    links: [
      ["All Products", "/shop"],
      ["New Arrivals", "/shop?sort=newest"],
      ["T-Shirts", "/shop?category=T-Shirts"],
      ["Hoodies", "/shop?category=Hoodies"],
      ["Jackets", "/shop?category=Jackets"],
      ["Accessories", "/shop?category=Accessories"],
    ],
  },
  {
    title: "Support",
    links: [
      ["Contact Us", "/contact"],
      ["Shipping", "/shipping"],
      ["Returns", "/returns"],
      ["FAQ", "/faq"],
      ["Size Guide", "/shop"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "/about"],
      ["Privacy Policy", "/privacy"],
      ["Terms of Service", "/terms"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-[color:var(--surface)]">
      <div className="container-lux py-14">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
          <div className="col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground leading-relaxed">
              Modern fashion for those who lead, not follow. Premium essentials
              crafted with intention.
            </p>
            <form className="mt-6 flex rounded-lg border border-border bg-background overflow-hidden max-w-sm">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
              />
              <button className="bg-[color:var(--gold)] text-[color:var(--ink)] px-4 text-sm font-semibold">
                Subscribe
              </button>
            </form>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="text-sm font-bold text-foreground">{c.title}</h4>
              <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                {c.links.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="hover:text-foreground transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Saint Vital. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              aria-label="Instagram"
              className="hover:text-foreground"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Facebook" className="hover:text-foreground">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-foreground">
              <Twitter className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
