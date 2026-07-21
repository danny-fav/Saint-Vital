import Link from "next/link";

export function Logo({ compact = false, className = "" }) {
  const size = compact ? 30 : 36;
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 leading-none ${className}`}
    >
      <img
        src="/assets/saint-vital-mark.png"
        alt="Saint Vital"
        style={{ height: size, width: "auto" }}
        className="block select-none"
        draggable={false}
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
