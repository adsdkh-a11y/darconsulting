"use client";
import { createContext, useContext, useMemo } from "react";
import type { DictKey, Locale } from "@/lib/i18n";

type Ctx = { locale: Locale; dict: Record<DictKey, string> };
const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ locale, dict, children }: Ctx & { children: React.ReactNode }) {
  return <I18nContext.Provider value={{ locale, dict }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("I18nProvider missing");
  const t = useMemo(
    () => (key: DictKey, vars?: Record<string, string | number>) => {
      let s = ctx.dict[key] ?? key;
      if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
      return s;
    },
    [ctx.dict],
  );
  return { t, locale: ctx.locale };
}
