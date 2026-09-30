export const DAY = 86400_000;

/** 'YYYY-MM-DD' → Date at UTC midnight (how @db.Date values are stored). */
export function dayToDate(day: string): Date {
  return new Date(`${day}T00:00:00.000Z`);
}

export function dateToDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function todayDay(now = new Date()): string {
  return dateToDay(now);
}

export function addDays(day: string, n: number): string {
  return dateToDay(new Date(dayToDate(day).getTime() + n * DAY));
}

export function daysBetween(a: string, b: string): number {
  return Math.round((dayToDate(b).getTime() - dayToDate(a).getTime()) / DAY);
}

export function fmtDay(d: Date | string, locale = "en"): string {
  const date = typeof d === "string" ? dayToDate(d.slice(0, 10)) : d;
  return date.toLocaleDateString(locale === "ar" ? "ar" : locale, { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}
