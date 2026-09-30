"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "./I18n";
import { cx } from "./ui";

const ITEMS = [
  { href: "/home", key: "nav.home", icon: "M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" },
  { href: "/log", key: "nav.log", icon: "M12 5v14M5 12h14" },
  { href: "/timeline", key: "nav.timeline", icon: "M4 6h16M4 12h10M4 18h13" },
  { href: "/map", key: "nav.map", icon: "M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" },
  { href: "/me", key: "nav.more", icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-8 9a8 8 0 0 1 16 0" },
] as const;

export function BottomNav() {
  const path = usePathname();
  const { t } = useI18n();
  return (
    <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <ul className="mx-auto flex max-w-md">
        {ITEMS.map((it) => {
          const active = path === it.href || path.startsWith(`${it.href}/`);
          return (
            <li key={it.href} className="flex-1">
              <Link href={it.href} aria-current={active ? "page" : undefined} className={cx("tap flex flex-col items-center gap-0.5 py-2 text-xs font-medium", active ? "text-primary" : "text-muted")}>
                <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d={it.icon} />
                </svg>
                {t(it.key)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
