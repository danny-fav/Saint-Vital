"use client";

import Link from "next/link";
import { useState } from "react";
import { PageShell } from "@/components/site/PageShell";
import { Check } from "lucide-react";



const steps = ["Shipping", "Payment", "Review", "Confirmation"];

export default function Checkout() {
  const [step, setStep] = useState(0);

  return (
    <PageShell>
      <section className="container-lux py-16">
        <div className="max-w-3xl mx-auto">
          {/* Stepper */}
          <div className="flex items-center justify-between mb-16">
            {steps.map((s, i) => (
              <div key={s} className="flex-1 flex items-center">
                <div
                  className={`h-8 w-8 rounded-full border flex items-center justify-center text-xs ${
                    i <= step
                      ? "border-[color:var(--gold)] text-[color:var(--gold)]"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {i < step ? <Check className="h-3 w-3" /> : i + 1}
                </div>
                <span
                  className={`ml-3 text-xs tracking-[0.24em] uppercase hidden md:inline ${i <= step ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {s}
                </span>
                {i < steps.length - 1 && (
                  <div
                    className={`flex-1 mx-4 h-px ${i < step ? "bg-[color:var(--gold)]" : "bg-border"}`}
                  />
                )}
              </div>
            ))}
          </div>

          {step === 0 && (
            <div>
              <h2 className="font-display text-3xl mb-8">Shipping Details</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  "First Name",
                  "Last Name",
                  "Address",
                  "City",
                  "Postal Code",
                  "Country",
                ].map((f) => (
                  <div key={f}>
                    <label className="text-eyebrow block mb-2">{f}</label>
                    <input className="w-full bg-transparent border-b border-border py-3 text-sm outline-none focus:border-[color:var(--gold)]" />
                  </div>
                ))}
              </div>
            </div>
          )}
          {step === 1 && (
            <div>
              <h2 className="font-display text-3xl mb-8">Payment</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {["Card", "Stripe", "Paystack", "Flutterwave"].map((m) => (
                  <button
                    key={m}
                    className="border border-border py-4 text-xs tracking-[0.2em] uppercase hover:border-[color:var(--gold)] hover:text-[color:var(--gold)]"
                  >
                    {m}
                  </button>
                ))}
              </div>
              <div className="space-y-6">
                <div>
                  <label className="text-eyebrow block mb-2">Card Number</label>
                  <input
                    className="w-full bg-transparent border-b border-border py-3 text-sm outline-none focus:border-[color:var(--gold)]"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-eyebrow block mb-2">Expiry</label>
                    <input
                      className="w-full bg-transparent border-b border-border py-3 text-sm outline-none focus:border-[color:var(--gold)]"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="text-eyebrow block mb-2">CVC</label>
                    <input
                      className="w-full bg-transparent border-b border-border py-3 text-sm outline-none focus:border-[color:var(--gold)]"
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <h2 className="font-display text-3xl mb-8">Review Order</h2>
              <div className="card-lux p-8 space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items (2)</span>
                  <span>$261.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Complimentary</span>
                </div>
                <div className="flex justify-between border-t border-border pt-4">
                  <span className="font-display text-lg">Total</span>
                  <span className="font-display text-lg text-[color:var(--gold)]">
                    $261.00
                  </span>
                </div>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="text-center py-16">
              <div className="mx-auto h-16 w-16 rounded-full border border-[color:var(--gold)] flex items-center justify-center text-[color:var(--gold)]">
                <Check className="h-6 w-6" />
              </div>
              <p className="text-eyebrow mt-6">Order Confirmed</p>
              <h2 className="font-display text-4xl mt-4">
                Thank you for your order.
              </h2>
              <p className="text-muted-foreground mt-4">
                Order #SV-284910 · A confirmation has been sent to your email.
              </p>
              <Link href="/order/success"
                className="btn-gold btn-gold-hover mt-8 inline-flex"
              >
                View Order
              </Link>
            </div>
          )}

          {step < 3 && (
            <div className="flex justify-between mt-12">
              <button
                disabled={step === 0}
                onClick={() => setStep(step - 1)}
                className="btn-outline-gold disabled:opacity-30"
              >
                Back
              </button>
              <button
                onClick={() => setStep(step + 1)}
                className="btn-gold btn-gold-hover"
              >
                {step === 2 ? "Place Order" : "Continue"}
              </button>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );

}
