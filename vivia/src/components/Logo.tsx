import { useId } from "react";

/** Awareness-ribbon mark (violet is the IBD / MICI colour) whose crossed tails read as a "V". */
export function LogoMark({ className = "size-9", mono = false }: { className?: string; mono?: boolean }) {
  const id = useId();
  const stroke = mono ? "currentColor" : `url(#${id})`;
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden fill="none">
      {!mono && (
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#c9b6ff" />
            <stop offset="1" stopColor="#7a52e0" />
          </linearGradient>
        </defs>
      )}
      <path d="M50 12C30 12 24 34 38 50L62 88" stroke={stroke} strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M50 12C70 12 76 34 62 50L38 88" stroke={stroke} strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" opacity={mono ? 1 : 0.85} />
    </svg>
  );
}

/** Mark + "VIVIA" wordmark, with the MICI / IBD tag. */
export function Logo({ size = "md", tag = false, mono = false }: { size?: "sm" | "md" | "lg"; tag?: boolean; mono?: boolean }) {
  const s = { sm: ["size-7", "text-lg"], md: ["size-9", "text-2xl"], lg: ["size-24 shrink-0", "text-5xl"] }[size];
  return (
    <span className="inline-flex flex-col items-center gap-0.5">
      <span className={`inline-flex items-center ${size === "lg" ? "flex-col gap-3" : "gap-2.5"}`}>
        <LogoMark className={s[0]} mono={mono} />
        <span className={`font-display font-extrabold tracking-[0.06em] ${s[1]}`}>VIVIA</span>
      </span>
      {tag && <span className={`${size === "lg" ? "mt-1 " : ""}text-[0.7rem] font-semibold uppercase tracking-[0.28em] opacity-80`}>MICI · IBD</span>}
    </span>
  );
}
