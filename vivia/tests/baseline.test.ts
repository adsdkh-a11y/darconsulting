import { describe, expect, it } from "vitest";
import { computeBaseline, detectChange } from "@/server/services/baseline";
import { addDays } from "@/lib/dates";

const today = "2026-09-30";
const series = (vals: number[]) => vals.map((v, i) => ({ day: addDays(today, -(vals.length - 1 - i)), value: v }));

describe("personal baseline", () => {
  it("is not shown without enough data", () => {
    expect(computeBaseline(series([2, 2, 3]), today, 7)).toBeNull();
    expect(computeBaseline(series(Array(10).fill(2)), today, 30)).toBeNull();
  });

  it("computes mean and sd from the user's own data", () => {
    const b = computeBaseline(series(Array(30).fill(2)), today, 30)!;
    expect(b.mean).toBe(2);
    expect(b.sd).toBe(0);
  });

  it("detects 3+ consecutive days above the 30-day baseline", () => {
    const vals = [...Array(37).fill(2), 2, 2, 2, 2, 5, 6, 5];
    const c = detectChange("bowelMovements", series(vals), today)!;
    expect(c.consecutiveDays).toBe(3);
    expect(c.since).toBe("2026-09-28");
    expect(c.baselineMean).toBe(2);
  });

  it("ignores small changes and short spikes", () => {
    expect(detectChange("bowelMovements", series([...Array(40).fill(2), 3, 3, 3]), today)).toBeNull();
    expect(detectChange("bowelMovements", series([...Array(40).fill(2), 2, 6, 6]), today)).toBeNull();
  });

  it("does not report stale changes", () => {
    const vals = [...Array(35).fill(2), 6, 6, 6];
    const pts = series(vals).map((p) => ({ ...p, day: addDays(p.day, -4) }));
    expect(detectChange("bowelMovements", pts, today)).toBeNull();
  });
});
