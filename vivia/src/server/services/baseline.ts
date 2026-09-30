/**
 * Personal baselines — computed ONLY from the patient's own history.
 * No universal "normal", no scores-as-grades, no diagnosis. A change is
 * described as a change from the person's own recent pattern.
 */
import { addDays } from "@/lib/dates";

export type DailyPoint = { day: string; value: number };

export const BASELINE_METRICS = ["bowelMovements", "pain", "fatigue", "urgency", "blood", "nightBowelMovements"] as const;
export type BaselineMetric = (typeof BASELINE_METRICS)[number];

/** Minimum logged days before a baseline is shown at all. */
export const MIN_DAYS: Record<7 | 30 | 90, number> = { 7: 5, 30: 14, 90: 30 };

/** Minimum absolute difference that counts as "above" (avoid flagging noise). */
const MIN_DELTA: Record<BaselineMetric, number> = {
  bowelMovements: 1,
  nightBowelMovements: 1,
  pain: 2,
  fatigue: 2,
  urgency: 1,
  blood: 1,
};

export type Baseline = { window: 7 | 30 | 90; mean: number; sd: number; days: number } | null;

export function computeBaseline(points: DailyPoint[], endDayInclusive: string, window: 7 | 30 | 90): Baseline {
  const start = addDays(endDayInclusive, -(window - 1));
  const vals = points.filter((p) => p.day >= start && p.day <= endDayInclusive).map((p) => p.value);
  if (vals.length < MIN_DAYS[window]) return null;
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  const sd = Math.sqrt(vals.reduce((a, b) => a + (b - mean) ** 2, 0) / vals.length);
  return { window, mean, sd, days: vals.length };
}

export type BaselineChange = {
  metric: BaselineMetric;
  consecutiveDays: number;
  since: string;
  baselineMean: number;
  recentMean: number;
};

/**
 * Detect "above your recent 30-day baseline for N days".
 * Baseline = the 30 days before the most recent 7 days, so a recent change
 * does not contaminate the reference. Requires ≥3 consecutive logged days.
 */
export function detectChange(metric: BaselineMetric, points: DailyPoint[], today: string, minConsecutive = 3): BaselineChange | null {
  const base = computeBaseline(points, addDays(today, -7), 30);
  if (!base) return null;
  const threshold = base.mean + Math.max(base.sd, MIN_DELTA[metric]);
  const recent = points.filter((p) => p.day > addDays(today, -7) && p.day <= today).sort((a, b) => (a.day < b.day ? 1 : -1));
  let n = 0;
  let since = today;
  let sum = 0;
  let expectedDay = recent[0]?.day;
  for (const p of recent) {
    if (p.day !== expectedDay) break; // must be consecutive logged days
    if (p.value <= threshold) break;
    n++;
    sum += p.value;
    since = p.day;
    expectedDay = addDays(p.day, -1);
  }
  // The most recent logged day must be today or yesterday to be "current".
  if (!recent[0] || recent[0].day < addDays(today, -1)) return null;
  if (n < minConsecutive) return null;
  return { metric, consecutiveDays: n, since, baselineMean: round1(base.mean), recentMean: round1(sum / n) };
}

export function compareWindows(points: DailyPoint[], today: string) {
  const last7 = computeBaseline(points, today, 7);
  const prior30 = computeBaseline(points, addDays(today, -7), 30);
  if (!last7 || !prior30) return null;
  const diff = last7.mean - prior30.mean;
  return { last7: round1(last7.mean), prior30: round1(prior30.mean), direction: Math.abs(diff) < 0.5 ? "similar" : diff > 0 ? "higher" : "lower" } as const;
}

export const round1 = (n: number) => Math.round(n * 10) / 10;
