import Link from "next/link";

/** Always one tap away, on every screen. Coral is reserved for urgency. */
export function BathroomButton({ label }: { label: string }) {
  return (
    <Link href="/bathroom" className="tap wc-pulse inline-flex shrink-0 whitespace-nowrap items-center gap-2 rounded-full bg-accent py-2 pe-4 ps-3 text-sm font-bold text-accent-ink" aria-label={label}>
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="8" cy="5" r="1.8" /><circle cx="16" cy="5" r="1.8" /><path d="M8 8.5v5.5M5.5 21 8 14l2.5 7M16 8.5v5.5M14 14h4l-2 7z" />
      </svg>
      <span>{label}</span>
    </Link>
  );
}
