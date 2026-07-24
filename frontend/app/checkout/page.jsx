"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/site/PageShell";
import { Check, Loader2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/auth";
import { paymentService } from "@/services/payment";
import { useCreateOrder } from "@/hooks/useOrders";

const steps = ["Shipping", "Payment", "Review", "Confirmation"];

export default function Checkout() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { cart } = useCart();
  const createOrder = useCreateOrder();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [error, setError] = useState("");

  const [address, setAddress] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    line1: "",
    city: "",
    state: "",
    postal_code: "",
    country: "NG",
  });

  const [paymentMethod, setPaymentMethod] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth?redirect=/checkout");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    setError("");
    try {
      const addrRes = await authService.createAddress(address);
      const addressId = addrRes.data.id;

      const orderRes = await createOrder.mutateAsync({
        shipping_address: addressId,
        payment_method: paymentMethod,
      });
      const order = orderRes;

      const origin = window.location.origin;
      const payRes = await paymentService.initiate(order.id, {
        provider: paymentMethod,
        redirect_url: `${origin}/order/success`,
      });

      setOrderResult({ orderNumber: order.order_number });
      setStep(3);

      if (payRes.data.authorization_url) {
        window.location.href = payRes.data.authorization_url;
      }
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (field) => (e) => {
    setAddress((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const canContinue = () => {
    if (step === 0) {
      return address.first_name && address.last_name && address.phone && address.line1 && address.city;
    }
    if (step === 1) return !!paymentMethod;
    return true;
  };

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
                <div>
                  <label className="text-eyebrow block mb-2">First Name</label>
                  <input value={address.first_name} onChange={updateField("first_name")} className="w-full bg-transparent border-b border-border py-3 text-sm outline-none focus:border-[color:var(--gold)]" />
                </div>
                <div>
                  <label className="text-eyebrow block mb-2">Last Name</label>
                  <input value={address.last_name} onChange={updateField("last_name")} className="w-full bg-transparent border-b border-border py-3 text-sm outline-none focus:border-[color:var(--gold)]" />
                </div>
                <div>
                  <label className="text-eyebrow block mb-2">Phone</label>
                  <input value={address.phone} onChange={updateField("phone")} className="w-full bg-transparent border-b border-border py-3 text-sm outline-none focus:border-[color:var(--gold)]" />
                </div>
                <div>
                  <label className="text-eyebrow block mb-2">Email</label>
                  <input value={user?.email || ""} disabled className="w-full bg-transparent border-b border-border py-3 text-sm outline-none opacity-60" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-eyebrow block mb-2">Address</label>
                  <input value={address.line1} onChange={updateField("line1")} className="w-full bg-transparent border-b border-border py-3 text-sm outline-none focus:border-[color:var(--gold)]" />
                </div>
                <div>
                  <label className="text-eyebrow block mb-2">City</label>
                  <input value={address.city} onChange={updateField("city")} className="w-full bg-transparent border-b border-border py-3 text-sm outline-none focus:border-[color:var(--gold)]" />
                </div>
                <div>
                  <label className="text-eyebrow block mb-2">State</label>
                  <input value={address.state} onChange={updateField("state")} className="w-full bg-transparent border-b border-border py-3 text-sm outline-none focus:border-[color:var(--gold)]" />
                </div>
                <div>
                  <label className="text-eyebrow block mb-2">Postal Code</label>
                  <input value={address.postal_code} onChange={updateField("postal_code")} className="w-full bg-transparent border-b border-border py-3 text-sm outline-none focus:border-[color:var(--gold)]" />
                </div>
                <div>
                  <label className="text-eyebrow block mb-2">Country</label>
                  <select value={address.country} onChange={updateField("country")} className="w-full bg-transparent border-b border-border py-3 text-sm text-foreground outline-none focus:border-[color:var(--gold)]">
                    <option value="NG">Nigeria</option>
                    <option value="GH">Ghana</option>
                    <option value="KE">Kenya</option>
                    <option value="ZA">South Africa</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="font-display text-3xl mb-8">Payment</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {[
                  { key: "paystack", label: "Paystack" },
                  { key: "flutterwave", label: "Flutterwave" },
                ].map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setPaymentMethod(m.key)}
                    className={`border py-4 text-xs tracking-[0.2em] uppercase ${
                      paymentMethod === m.key
                        ? "border-[color:var(--gold)] text-[color:var(--gold)]"
                        : "border-border hover:border-[color:var(--gold)] hover:text-[color:var(--gold)]"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                You will be redirected to complete payment securely.
              </p>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-display text-3xl mb-8">Review Order</h2>
              <div className="card-lux p-8 space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items ({cart?.item_count || 0})</span>
                  <span>${cart?.subtotal || "0.00"}</span>
                </div>
                {cart?.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="text-muted-foreground">Discount</span>
                    <span>-${cart.discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Calculated at next step</span>
                </div>
                <div className="flex justify-between border-t border-border pt-4">
                  <span className="font-display text-lg">Total</span>
                  <span className="font-display text-lg text-[color:var(--gold)]">
                    ${cart?.total || "0.00"}
                  </span>
                </div>
              </div>
              <div className="card-lux p-8 mt-6 text-sm">
                <h4 className="font-display text-lg mb-4">Shipping To</h4>
                <p>{address.first_name} {address.last_name}</p>
                <p className="text-muted-foreground">{address.line1}</p>
                <p className="text-muted-foreground">{address.city}, {address.state} {address.postal_code}</p>
                <p className="text-muted-foreground">{address.country}</p>
                <p className="text-muted-foreground mt-2">{address.phone}</p>
              </div>
              <div className="card-lux p-8 mt-6 text-sm">
                <h4 className="font-display text-lg mb-4">Payment Method</h4>
                <p className="uppercase tracking-wider">{paymentMethod}</p>
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
                {orderResult?.orderNumber
                  ? `Order #${orderResult.orderNumber}`
                  : "Your order has been placed."}
                {paymentMethod ? " · Redirecting to payment..." : ""}
              </p>
              <Link href="/order/success" className="btn-gold btn-gold-hover mt-8 inline-flex">
                View Order
              </Link>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 border border-red-500/30 text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          {step < 3 && (
            <div className="flex justify-between mt-12">
              <button
                disabled={step === 0}
                onClick={() => setStep((s) => s - 1)}
                className="btn-outline-gold disabled:opacity-30 disabled:pointer-events-none disabled:hover:bg-transparent disabled:hover:text-[color:var(--gold)]"
              >
                Back
              </button>
              <button
                disabled={!canContinue() || submitting}
                onClick={() => {
                  if (step < 2) {
                    setStep((s) => s + 1);
                  } else {
                    handlePlaceOrder();
                  }
                }}
                className="btn-gold btn-gold-hover disabled:opacity-50 disabled:pointer-events-none inline-flex items-center gap-2"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {step === 2 ? "Place Order" : "Continue"}
              </button>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}