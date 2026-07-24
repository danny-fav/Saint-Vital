"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageShell, PageHero } from "@/components/site/PageShell";
import { useAuth } from "@/hooks/useAuth";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/account";
  const { login, register } = useAuth();
  const [mode, setMode] = useState(searchParams.get("mode") === "signup" ? "signup" : "signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "", first_name: "", last_name: "", password_confirm: "" });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (mode === "signin") {
        await login(form.email, form.password);
      } else {
        await register({
          email: form.email,
          password: form.password,
          password_confirm: form.password_confirm,
          first_name: form.first_name,
          last_name: form.last_name,
        });
      }
      router.push(redirectTo);
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.response?.data?.email?.[0] || "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

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
          <form className="space-y-6" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-eyebrow block mb-2">First Name</label>
                  <input
                    value={form.first_name}
                    onChange={handleChange("first_name")}
                    className="w-full bg-transparent border-b border-border py-3 text-sm outline-none focus:border-[color:var(--gold)]"
                  />
                </div>
                <div>
                  <label className="text-eyebrow block mb-2">Last Name</label>
                  <input
                    value={form.last_name}
                    onChange={handleChange("last_name")}
                    className="w-full bg-transparent border-b border-border py-3 text-sm outline-none focus:border-[color:var(--gold)]"
                  />
                </div>
              </div>
            )}
            <div>
              <label className="text-eyebrow block mb-2">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                className="w-full bg-transparent border-b border-border py-3 text-sm outline-none focus:border-[color:var(--gold)]"
              />
            </div>
            <div>
              <label className="text-eyebrow block mb-2">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={handleChange("password")}
                className="w-full bg-transparent border-b border-border py-3 text-sm outline-none focus:border-[color:var(--gold)]"
              />
            </div>
            {mode === "signup" && (
              <div>
                <label className="text-eyebrow block mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={form.password_confirm}
                  onChange={handleChange("password_confirm")}
                  className="w-full bg-transparent border-b border-border py-3 text-sm outline-none focus:border-[color:var(--gold)]"
                />
              </div>
            )}
            {error && (
              <p className="text-red-500 text-xs text-center">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn-gold btn-gold-hover w-full disabled:opacity-60"
            >
              {loading ? "Loading..." : mode === "signin" ? "Sign In" : "Create Account"}
            </button>
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

export default function Auth() {
  return (
    <Suspense fallback={<div className="container-lux py-16 text-center text-muted-foreground">Loading...</div>}>
      <AuthForm />
    </Suspense>
  );
}
