"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "./I18n";
import { api } from "@/lib/api";
import { localDay } from "@/lib/clientDate";
import type { DictKey } from "@/lib/i18n";

const FACES = [
  "M8 16c1.2-1 2.6-1.4 4-1.4S14.8 15 16 16M8 10l2 1M16 10l-2 1",
  "M8.5 15.8c1-.7 2.3-1 3.5-1s2.5.3 3.5 1M9 10h.01M15 10h.01",
  "M8.5 15h7M9 10h.01M15 10h.01",
  "M8.5 14c1 1.3 2.2 1.9 3.5 1.9s2.5-.6 3.5-1.9M9 10h.01M15 10h.01",
  "M7.5 13.5c1 2.2 2.6 3.2 4.5 3.2s3.5-1 4.5-3.2zM9 9.8h.01M15 9.8h.01",
];

/** The hero check-in: one tap saves today's mood. Progressive disclosure starts here. */
export function MoodHero({ dateLabel, doneToday }: { dateLabel: string; doneToday: boolean }) {
  const { t } = useI18n();
  const router = useRouter();
  const [done, setDone] = useState(doneToday);
  const [pressed, setPressed] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function save(run: () => Promise<unknown>) {
    setError(null);
    try {
      await run();
      setDone(true);
      router.refresh();
    } catch (e) {
      setPressed(null);
      setError((e as Error).message);
    }
  }

  if (done)
    return (
      <div className="flex min-h-[150px] items-center gap-4" role="status">
        <svg viewBox="0 0 76 76" className="size-[76px] flex-none" aria-hidden>
          <circle cx="38" cy="38" r="36" className="pop fill-primary" style={{ transformBox: "fill-box", transformOrigin: "center" }} />
          <path d="M23 39l10 10 20-22" fill="none" stroke="var(--primary-ink)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="40" strokeDashoffset="40" style={{ animation: "draw .45s .25s ease-out forwards" }} />
        </svg>
        <div>
          <p className="font-display text-[28px] font-extrabold leading-tight tracking-[-0.03em]">{t("home.done.title")}</p>
          <p className="text-sm opacity-80">{t("log.saved")}</p>
          <button className="tap mt-1 text-sm font-bold opacity-90 underline-offset-4 hover:underline" onClick={() => setDone(false)}>{t("common.edit")}</button>
        </div>
      </div>
    );

  return (
    <div>
      <p className="text-[13px] font-bold opacity-75">{dateLabel}</p>
      <h1 className="font-display mb-5 mt-1.5 text-balance text-[30px] font-extrabold leading-[1.08] tracking-[-0.035em]">{t("home.howFeeling")}</h1>
      <div className="grid grid-cols-5 gap-2" role="group" aria-label={t("sym.overall")}>
        {FACES.map((d, i) => (
          <button key={i} aria-label={t(`sym.overall.${i + 1}` as DictKey)}
            className="grid aspect-square place-items-center rounded-full bg-white/10 transition duration-200 hover:bg-white/20 active:scale-90"
            style={pressed === i ? { transform: "scale(1.2)" } : undefined}
            onClick={() => { setPressed(i); setTimeout(() => save(() => api("/api/symptoms", "POST", { date: localDay(), overall: i + 1 })), 160); }}>
            <svg viewBox="0 0 24 24" className="size-[58%]" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <circle cx="12" cy="12" r="9.5" /><path d={d} />
            </svg>
          </button>
        ))}
      </div>
      <div className="mt-1.5 grid grid-cols-5 gap-2 text-center text-[11px] font-semibold opacity-70" aria-hidden>
        {[1, 2, 3, 4, 5].map((i) => <span key={i}>{t(`sym.overall.${i}` as DictKey)}</span>)}
      </div>
      <div className="mt-4 flex gap-2">
        <button className="tap flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-2xl bg-white/12 text-sm font-bold transition active:scale-95"
          onClick={() => save(() => api("/api/symptoms/repeat", "POST", { date: localDay() }))}>
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
          {t("log.repeat")}
        </button>
        <Link href="/log" className="tap flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-2xl bg-white/12 text-sm font-bold transition active:scale-95">
          {t("home.quickCheckin")}
        </Link>
      </div>
      {error && <p role="alert" className="mt-3 text-sm font-semibold text-[#ffb4a6]">{error}</p>}
    </div>
  );
}
