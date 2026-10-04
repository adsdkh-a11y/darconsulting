import { withUser, body } from "@/server/http";
import { z } from "zod";
import { submitQuestionnaire } from "@/server/services/questionnaires";

export const POST = withUser(async ({ req, userId }) => {
  const { code, answers } = await body(req, z.object({ code: z.string().max(20), answers: z.record(z.unknown()) }));
  const r = await submitQuestionnaire(userId, code, answers);
  return { id: r.id, score: r.score };
});
