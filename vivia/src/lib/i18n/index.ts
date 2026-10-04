import { en, type DictKey } from "./en";
import { it } from "./it";
import { fr } from "./fr";
import { es } from "./es";
import { de } from "./de";
import { ar } from "./ar";

export type { DictKey };
export const LOCALES = ["en", "it", "fr", "es", "de", "ar"] as const;
export type Locale = (typeof LOCALES)[number];
export const LOCALE_NAMES: Record<Locale, string> = { en: "English", it: "Italiano", fr: "Français", es: "Español", de: "Deutsch", ar: "العربية" };
export const RTL: Locale[] = ["ar"];

const DICTS: Record<Locale, Partial<Record<DictKey, string>>> = { en, it, fr, es, de, ar };

export function normalizeLocale(l?: string | null): Locale {
  const base = (l ?? "").slice(0, 2).toLowerCase();
  return (LOCALES as readonly string[]).includes(base) ? (base as Locale) : "en";
}

export type T = (key: DictKey, vars?: Record<string, string | number>) => string;

export function translator(locale: Locale): T {
  const d = DICTS[locale];
  return (key, vars) => {
    let s = d[key] ?? en[key] ?? key;
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
    return s;
  };
}

/** The full dictionary for a locale with English fallback — passed to client components. */
export function dictionary(locale: Locale): Record<DictKey, string> {
  return { ...en, ...DICTS[locale] } as Record<DictKey, string>;
}
