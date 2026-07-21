import Link from "next/link";
import { PageShell } from "@/components/site/PageShell";

export default function NotFound() {
  return (
    <PageShell>
      <section className="container-lux py-24 text-center">
        <p className="text-eyebrow">Error 404</p>
        <h1 className="mt-4 font-display text-5xl md:text-7xl font-extrabold">
          Page not found
        </h1>
        <p className="mt-4 text-muted-foreground max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8">
          <Link href="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
