import { PageShell, PageHero } from "@/components/site/PageShell";

export default function TermsPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Legal"
        title="Terms of Service"
        subtitle="The terms governing your use of Saint Vital."
      />
      <section className="container-lux pb-24 max-w-3xl mx-auto text-sm text-muted-foreground leading-relaxed space-y-6">
        <h2 className="text-lg font-semibold text-foreground">1. Acceptance of Terms</h2>
        <p>By accessing or using Saint Vital, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>

        <h2 className="text-lg font-semibold text-foreground">2. Products and Pricing</h2>
        <p>All prices are listed in USD and are subject to change without notice. We reserve the right to modify or discontinue products at any time.</p>

        <h2 className="text-lg font-semibold text-foreground">3. Orders</h2>
        <p>We reserve the right to refuse or cancel any order. In the event of a pricing error, we will contact you before processing.</p>

        <h2 className="text-lg font-semibold text-foreground">4. Returns and Refunds</h2>
        <p>Please refer to our Returns Policy for information on returns, exchanges, and refunds.</p>

        <h2 className="text-lg font-semibold text-foreground">5. Intellectual Property</h2>
        <p>All content on this site, including designs, text, images, and logos, is the property of Saint Vital and may not be reproduced without permission.</p>

        <h2 className="text-lg font-semibold text-foreground">6. Limitation of Liability</h2>
        <p>Saint Vital shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services.</p>

        <h2 className="text-lg font-semibold text-foreground">7. Governing Law</h2>
        <p>These terms are governed by the laws of the United States.</p>

        <p className="pt-6 text-xs">Last updated: January 2026</p>
      </section>
    </PageShell>
  );
}
