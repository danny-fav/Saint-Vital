"use client";

import { useState } from "react";

export default function AdminSettings() {
  const [storeName, setStoreName] = useState("Saint Vital");
  const [currency, setCurrency] = useState("USD");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 lg:p-10">
      <h1 className="font-display text-3xl mb-8">Settings</h1>

      <div className="max-w-xl space-y-8">
        <div className="card-lux p-8 space-y-6">
          <h3 className="font-display text-xl">Store Settings</h3>
          <div>
            <label className="text-eyebrow block mb-2">Store Name</label>
            <input
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full bg-transparent border-b border-border py-3 text-sm outline-none focus:border-[color:var(--gold)]"
            />
          </div>
          <div>
            <label className="text-eyebrow block mb-2">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-transparent border-b border-border py-3 text-sm text-foreground outline-none focus:border-[color:var(--gold)]"
            >
              <option value="USD">USD ($)</option>
              <option value="NGN">NGN (₦)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
          <button onClick={handleSave} className="btn-gold btn-gold-hover">
            {saved ? "Saved!" : "Save Settings"}
          </button>
        </div>

        <div className="card-lux p-8 space-y-6">
          <h3 className="font-display text-xl">Shipping</h3>
          <p className="text-sm text-muted-foreground">
            Configure shipping zones, rates, and free shipping thresholds.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-eyebrow block mb-2">Free Shipping Threshold</label>
              <input
                defaultValue="250"
                className="w-full bg-transparent border-b border-border py-3 text-sm outline-none focus:border-[color:var(--gold)]"
              />
            </div>
            <div>
              <label className="text-eyebrow block mb-2">Standard Rate</label>
              <input
                defaultValue="15"
                className="w-full bg-transparent border-b border-border py-3 text-sm outline-none focus:border-[color:var(--gold)]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
