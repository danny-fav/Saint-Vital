import { PageShell, PageHero } from "@/components/site/PageShell";

export default function PrivacyPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle="How we handle your data."
      />
      <section className="container-lux pb-24 max-w-3xl mx-auto text-sm text-muted-foreground leading-relaxed space-y-6">
        <h2 className="text-lg font-semibold text-foreground">1. Information We Collect</h2>
        <p>We collect information you provide directly, such as your name, email address, shipping address, and payment information when you make a purchase or create an account.</p>

        <h2 className="text-lg font-semibold text-foreground">2. How We Use Your Information</h2>
        <p>We use your information to process orders, communicate with you about your purchases, improve our products and services, and send marketing communications if you opt in.</p>

        <h2 className="text-lg font-semibold text-foreground">3. Data Protection</h2>
        <p>We implement industry-standard security measures to protect your personal information. Payment transactions are encrypted using SSL technology.</p>

        <h2 className="text-lg font-semibold text-foreground">4. Third-Party Services</h2>
        <p>We may share your information with trusted third parties who assist us in operating our website, processing payments, and fulfilling orders. These parties are contractually obligated to keep your information confidential.</p>

        <h2 className="text-lg font-semibold text-foreground">5. Cookies</h2>
        <p>We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie preferences in your browser settings.</p>

        <h2 className="text-lg font-semibold text-foreground">6. Your Rights</h2>
        <p>You have the right to access, correct, or delete your personal data at any time. Contact us to exercise these rights.</p>

        <h2 className="text-lg font-semibold text-foreground">7. Contact</h2>
        <p>For questions about this policy, contact us at privacy@saintvital.com.</p>

        <p className="pt-6 text-xs">Last updated: January 2026</p>
      </section>
    </PageShell>
  );
}
