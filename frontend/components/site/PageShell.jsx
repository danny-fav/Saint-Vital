"use client";

import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function PageShell({ children, transparentNav = false }) {
  // transparentNav retained for API compatibility; navbar is always solid now.
  void transparentNav;
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export function PageHero({ eyebrow, title, subtitle }) {
  return (
    <section className="container-lux pt-10 pb-10 animate-fade-up">
      <p className="text-eyebrow">{eyebrow}</p>
      <h1 className="mt-2 font-display text-3xl md:text-5xl font-extrabold tracking-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3 max-w-2xl text-sm md:text-base text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      )}
    </section>
  );
}
