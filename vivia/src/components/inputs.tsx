"use client";
import { cx } from "./ui";

/** Large, thumb-friendly inputs for people who may be in pain or fatigued. */

export function Stepper({ label, value, onChange, max = 40 }: { label: string; value: number | null; onChange: (v: number | null) => void; max?: number }) {
  const v = value ?? 0;
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <span className="font-medium">{label}</span>
      <div className="flex items-center gap-2" role="group" aria-label={label}>
        <button type="button" className="tap grid size-12 place-items-center rounded-2xl bg-surface-2 text-2xl" aria-label={`${label} −1`} onClick={() => onChange(Math.max(0, v - 1))}>−</button>
        <output className={cx("w-10 text-center text-2xl font-semibold tabular-nums", value === null && "text-muted")} aria-live="polite">{value ?? "–"}</output>
        <button type="button" className="tap grid size-12 place-items-center rounded-2xl bg-primary-soft text-2xl text-primary" aria-label={`${label} +1`} onClick={() => onChange(Math.min(max, v + 1))}>+</button>
      </div>
    </div>
  );
}

export function Choice({ label, options, value, onChange }: { label: string; options: { value: number; label: string }[]; value: number | null; onChange: (v: number | null) => void }) {
  return (
    <fieldset className="py-2">
      <legend className="mb-2 font-medium">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button type="button" key={o.value} aria-pressed={value === o.value} onClick={() => onChange(value === o.value ? null : o.value)}
            className={cx("tap rounded-2xl border px-4 py-2 text-sm font-medium", value === o.value ? "border-primary bg-primary text-primary-ink" : "border-line bg-surface")}>
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function Scale({ label, value, onChange, lowLabel, highLabel }: { label: string; value: number | null; onChange: (v: number | null) => void; lowLabel?: string; highLabel?: string }) {
  return (
    <fieldset className="py-2">
      <legend className="mb-2 flex w-full justify-between font-medium">
        <span>{label}</span>
        <span className="tabular-nums text-muted">{value ?? "–"}/10</span>
      </legend>
      <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-11">
        {Array.from({ length: 11 }, (_, i) => (
          <button type="button" key={i} aria-pressed={value === i} aria-label={`${label} ${i}`} onClick={() => onChange(value === i ? null : i)}
            className={cx("tap rounded-xl border text-sm font-semibold tabular-nums", value === i ? "border-primary bg-primary text-primary-ink" : "border-line bg-surface")}>
            {i}
          </button>
        ))}
      </div>
      {(lowLabel || highLabel) && (
        <div className="mt-1 flex justify-between text-xs text-muted"><span>{lowLabel}</span><span>{highLabel}</span></div>
      )}
    </fieldset>
  );
}

const FACES = [
  "M8 16c1.2-1 2.6-1.4 4-1.4S14.8 15 16 16M8 10l2 1M16 10l-2 1",
  "M8.5 15.8c1-.7 2.3-1 3.5-1s2.5.3 3.5 1M9 10h.01M15 10h.01",
  "M8.5 15h7M9 10h.01M15 10h.01",
  "M8.5 14c1 1.3 2.2 1.9 3.5 1.9s2.5-.6 3.5-1.9M9 10h.01M15 10h.01",
  "M7.5 13.5c1 2.2 2.6 3.2 4.5 3.2s3.5-1 4.5-3.2zM9 9.8h.01M15 9.8h.01",
];
export function Overall({ label, labels, value, onChange }: { label: string; labels: string[]; value: number | null; onChange: (v: number) => void }) {
  return (
    <fieldset>
      <legend className="mb-3 font-display text-xl font-extrabold tracking-[-0.03em]">{label}</legend>
      <div className="grid grid-cols-5 gap-2">
        {FACES.map((d, i) => (
          <button type="button" key={i} aria-pressed={value === i + 1} aria-label={labels[i]} onClick={() => onChange(i + 1)}
            className={cx("tap flex flex-col items-center rounded-2xl border py-2 transition active:scale-95", value === i + 1 ? "border-primary bg-primary-soft text-primary" : "border-line bg-surface-2 text-ink-2")}>
            <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden><circle cx="12" cy="12" r="9.5" /><path d={d} /></svg>
            <span className="mt-1 text-[11px] font-semibold leading-tight">{labels[i]}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}
