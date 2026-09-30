import Link from "next/link";

/** Always one tap away, on every screen. */
export function BathroomButton({ label }: { label: string }) {
  return (
    <Link href="/bathroom" className="tap inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm" aria-label={label}>
      <span aria-hidden>🚻</span>
      <span>{label}</span>
    </Link>
  );
}
