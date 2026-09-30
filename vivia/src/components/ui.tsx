/* VIVIA UI primitives — large touch targets, calm surfaces, no alarm colours. */
import Link from "next/link";
import { Icon, type IconName } from "./Icon";
import type { ComponentProps, ReactNode } from "react";

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

type Variant = "primary" | "secondary" | "ghost" | "accent" | "danger";
const variants: Record<Variant, string> = {
  primary: "bg-primary text-primary-ink hover:opacity-90",
  secondary: "bg-surface-2 text-ink hover:opacity-90",
  ghost: "text-primary hover:bg-primary-soft",
  accent: "bg-accent text-accent-ink hover:opacity-90",
  danger: "bg-surface-2 text-danger hover:opacity-90",
};
const btnBase = "tap inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-bold transition active:scale-[0.97] disabled:bg-surface-2 disabled:text-muted disabled:border-line disabled:pointer-events-none";

export function Button({ variant = "primary", className, ...p }: ComponentProps<"button"> & { variant?: Variant }) {
  return <button className={cx(btnBase, variants[variant], className)} {...p} />;
}

export function ButtonLink({ variant = "primary", className, ...p }: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={cx(btnBase, variants[variant], className)} {...p} />;
}

export function Card({ className = "", ...p }: ComponentProps<"div">) {
  // Callers may override the surface; don't emit conflicting utilities.
  const bg = /(^|\s)bg-|hero-card/.test(className) ? "" : "bg-surface";
  const border = /(^|\s)border-none/.test(className) ? "" : "border border-line";
  return <div className={cx("rounded-[26px] p-5", bg, border, className)} {...p} />;
}

export function PageHeader({ title, subtitle, back, action }: { title: string; subtitle?: string; back?: string; action?: ReactNode }) {
  return (
    <header className="mb-5 pt-2">
      {back && (
        <Link href={back} className="tap -ms-3 inline-flex items-center px-3 text-sm font-medium text-muted" aria-label="Back">
          <span aria-hidden className="rtl:rotate-180">←</span>
        </Link>
      )}
      <div className="flex items-start justify-between gap-3">
        <h1 className="font-display text-[2rem] font-extrabold leading-[1.08] tracking-[-0.035em] text-ink">{title}</h1>
        {action}
      </div>
      {subtitle && <p className="mt-1 text-ink-2">{subtitle}</p>}
    </header>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-2 mt-7 flex items-center justify-between">
      <h2 className="text-[13px] font-bold uppercase tracking-[0.08em] text-muted">{children}</h2>
      {action}
    </div>
  );
}

export function Pill({ children, tone = "neutral", className }: { children: ReactNode; tone?: "neutral" | "primary" | "accent" | "warn"; className?: string }) {
  const tones = {
    neutral: "bg-surface-2 text-ink-2",
    primary: "bg-primary-soft text-primary",
    accent: "bg-accent-soft text-accent",
    warn: "bg-warn-soft text-warn",
  };
  return <span className={cx("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold", tones[tone], className)}>{children}</span>;
}

export function Field({ label, hint, children, htmlFor }: { label: string; hint?: string; children: ReactNode; htmlFor?: string }) {
  return (
    <div className="mb-4">
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
    </div>
  );
}

export const inputCls = "tap w-full rounded-2xl border border-line bg-surface-2 px-4 py-3 text-ink placeholder:text-muted focus:border-primary";

export function Input(p: ComponentProps<"input">) {
  return <input {...p} className={cx(inputCls, p.className)} />;
}
export function Textarea(p: ComponentProps<"textarea">) {
  return <textarea {...p} className={cx(inputCls, "min-h-28", p.className)} />;
}
export function Select(p: ComponentProps<"select">) {
  return <select {...p} className={cx(inputCls, "appearance-none", p.className)} />;
}

export function Notice({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "warn" | "primary" }) {
  const tones = { neutral: "bg-surface-2 text-ink-2", warn: "bg-warn-soft text-ink", primary: "bg-primary-soft text-ink" };
  return <div className={cx("rounded-2xl px-4 py-3 text-sm", tones[tone])}>{children}</div>;
}

export function ListLink({ href, title, detail, right, icon }: { href: string; title: ReactNode; detail?: ReactNode; right?: ReactNode; icon?: IconName }) {
  return (
    <Link href={href} className="tap flex items-center gap-3 border-b border-line py-3 last:border-0">
      {icon && <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-surface-2 text-ink" aria-hidden><Icon name={icon} /></span>}
      <span className="min-w-0 flex-1">
        <span className="block font-medium text-ink">{title}</span>
        {detail && <span className="block truncate text-sm text-muted">{detail}</span>}
      </span>
      {right}
      <span aria-hidden className="text-muted rtl:rotate-180">›</span>
    </Link>
  );
}
