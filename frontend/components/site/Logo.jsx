import Image from "next/image";
import Link from "next/link";

export function Logo({ compact = false, className = "" }) {
  const size = compact ? 30 : 36;
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 leading-none ${className}`}
    >
      <Image
        src="/assets/logo.png"
        alt="Saint Vital"
        width={size * 3}
        height={size}
        style={{ height: size, width: "auto" }}
        className="block select-none"
        draggable={false}
        priority
      />

      <span
        className="font-display font-semibold tracking-[0.14em] text-foreground uppercase"
        style={{ fontSize: compact ? "0.9rem" : "1rem" }}
      >
        Saint Vital
      </span>
    </Link>
  );
}
