"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "./I18n";
import { cx } from "./ui";

const ICONS = {
  home: "M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  timeline: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2",
  map: "M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  me: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-8 9a8 8 0 0 1 16 0",
  mic: "M9 3h6a0 0 0 0 1 0 0v8a3 3 0 0 1-6 0V3zM5 11a7 7 0 0 0 14 0M12 18v3",
} as const;

function Tab({ href, icon, label, active }: { href: string; icon: keyof typeof ICONS; label: string; active: boolean }) {
  return (
    <Link href={href} aria-current={active ? "page" : undefined} className={cx("tap flex min-h-[52px] flex-col items-center justify-center gap-0.5 text-[11px] font-bold transition-colors", active ? "text-primary" : "text-muted")}>
      <svg viewBox="0 0 24 24" className={cx("size-[22px] transition-transform duration-300", active && "-translate-y-0.5 scale-110")} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d={ICONS[icon]} />
      </svg>
      {label}
    </Link>
  );
}

export function BottomNav() {
  const path = usePathname();
  const { t } = useI18n();
  const on = (h: string) => path === h || path.startsWith(`${h}/`);
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 px-4 pb-[calc(12px+env(safe-area-inset-bottom))]">
      <nav aria-label="Main" className="glass pointer-events-auto mx-auto grid max-w-[440px] grid-cols-[1fr_1fr_84px_1fr_1fr] items-center rounded-[30px] border border-line px-1.5 py-2 shadow-[var(--shadow)]">
        <Tab href="/home" icon="home" label={t("nav.home")} active={on("/home")} />
        <Tab href="/timeline" icon="timeline" label={t("nav.timeline")} active={on("/timeline")} />
        <Link href="/log/tell" aria-label={t("home.tell")} className="mic-fab tap mx-auto -mt-[30px] grid size-16 place-items-center rounded-full bg-gradient-to-br from-[#7ff7d4] to-[#27b893] text-[#04201a] transition active:scale-90">
          <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="9" y="3" width="6" height="11" rx="3" />
            <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
          </svg>
        </Link>
        <Tab href="/map" icon="map" label={t("nav.map")} active={on("/map")} />
        <Tab href="/me" icon="me" label={t("nav.more")} active={on("/me")} />
      </nav>
    </div>
  );
}
