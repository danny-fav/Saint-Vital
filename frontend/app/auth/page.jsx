"use client";

import Link from "next/link";
import { useState } from "react";
import { PageShell, PageHero } from "@/components/site/PageShell";



export default function Auth() {
  const [mode, setMode] = useState("signin");
  return (
    <PageShell>
      <PageHero
        eyebrow={mode === "signin" ? "Welcome Back" : "Join Us"}
        title={mode === "signin" ? "Sign In" : "Create Account"}
      />
      <section className="container-lux pb-24">
        <div className="max-w-md mx-auto">
          <div className="flex border border-border mb-8">
            {["signin", "signup"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-3 text-xs tracking-[0.24em] uppercase transition ${mode === m ? "bg-[color:var(--gold)] text-[color:var(--ink)]" : "text-muted-foreground"}`}
              >
                {m === "signin" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>
          <form className="space-y-6">
            {mode === "signup" && (
              <div>
                <label className="text-eyebrow block mb-2">Name</label>
                <input className="w-full bg-transparent border-b border-border py-3 text-sm outline-none focus:border-[color:var(--gold)]" />
              </div>
            )}
            <div>
              <label className="text-eyebrow block mb-2">Email</label>
              <input
                type="email"
                className="w-full bg-transparent border-b border-border py-3 text-sm outline-none focus:border-[color:var(--gold)]"
              />
            </div>
            <div>
              <label className="text-eyebrow block mb-2">Password</label>
              <input
                type="password"
                className="w-full bg-transparent border-b border-border py-3 text-sm outline-none focus:border-[color:var(--gold)]"
              />
            </div>
            <Link href="/account" className="btn-gold btn-gold-hover w-full">
              {mode === "signin" ? "Sign In" : "Create Account"}
            </Link>
            <p className="text-center text-xs text-muted-foreground">
              Or continue with
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="border border-border py-3 text-xs tracking-[0.24em] uppercase hover:border-[color:var(--gold)]"
              >
                Google
              </button>
              <button
                type="button"
                className="border border-border py-3 text-xs tracking-[0.24em] uppercase hover:border-[color:var(--gold)]"
              >
                Apple
              </button>
            </div>
          </form>
        </div>
      </section>
    </PageShell>
  );

}
