import { withUser, body } from "@/server/http";
import { z } from "zod";
import { confirmLog } from "@/server/services/naturalLog";

const n = z.number().int().nullish();
const parsed = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullish(),
  bowelMovements: n, nightBowelMovements: n, liquidStools: n, stoolConsistency: n, stoolVariation: z.boolean().nullish(),
  blood: n, urgency: n, pain: n, fatigue: n, nausea: n, bloating: n, sleepQuality: n, stress: n,
  medicationsMentioned: z.array(z.object({ name: z.string().max(120), status: z.enum(["TAKEN", "SKIPPED", "DELAYED"]) })).max(20).nullish(),
  foods: z.array(z.string().max(200)).max(10).nullish(),
});

export const POST = withUser(async ({ req, userId }) => {
  const { runId, parsed: p, today } = await body(req, z.object({ runId: z.string().uuid(), parsed, today: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional() }));
  const clean = Object.fromEntries(Object.entries(p).filter(([, v]) => v !== null)) as Parameters<typeof confirmLog>[2];
  return confirmLog(userId, runId, clean, today);
});
