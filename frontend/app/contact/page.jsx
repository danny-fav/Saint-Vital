"use client";


import { PageShell, PageHero } from "@/components/site/PageShell";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";



export default function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <PageShell>
      <PageHero
        eyebrow="Client Care"
        title="In Correspondence"
        subtitle="We respond to every message within 24 hours, personally."
      />

      <section className="container-lux pb-24 grid lg:grid-cols-2 gap-16">
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="space-y-6"
          >
            {["Name", "Email", "Subject"].map((f) => (
              <div key={f}>
                <label className="text-eyebrow block mb-2">{f}</label>
                <input
                  required
                  className="w-full bg-transparent border-b border-border py-3 text-sm outline-none focus:border-[color:var(--gold)]"
                />
              </div>
            ))}
            <div>
              <label className="text-eyebrow block mb-2">Message</label>
              <textarea
                required
                rows={5}
                className="w-full bg-transparent border border-border p-4 text-sm outline-none focus:border-[color:var(--gold)]"
              />
            </div>
            <button className="btn-gold btn-gold-hover">Send Message</button>
            {sent && (
              <p className="text-sm text-[color:var(--gold)]">
                Thank you. We&apos;ll respond shortly.
              </p>
            )}
          </form>
        </div>

        <aside className="space-y-8">
          <div>
            <p className="text-eyebrow mb-4">Ateliers</p>
            {[
              [MapPin, "12 Rue Saint-Honoré, Paris 75001"],
              [MapPin, "Via Montenapoleone 8, Milano 20121"],
              [Mail, "clients@saintvital.com"],
              [Phone, "+33 1 42 61 82 00"],
            ].map(([Icon, val], i) => {
              const I = Icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 mb-3 text-sm text-muted-foreground"
                >
                  <I className="h-4 w-4 mt-0.5 text-[color:var(--gold)]" />{" "}
                  {val}
                </div>
              );
            })}
          </div>
          <div className="card-lux h-64 flex items-center justify-center text-muted-foreground text-xs tracking-[0.24em] uppercase">
            Map · Paris Flagship
          </div>
        </aside>
      </section>
    </PageShell>
  );

}
