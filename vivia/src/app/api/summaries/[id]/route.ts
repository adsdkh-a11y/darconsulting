import { withUser, body } from "@/server/http";
import { z } from "zod";
import { updateSummaryQuestions } from "@/server/services/summary";

export const PATCH = withUser<{ id: string }>(async ({ req, userId, params }) => {
  const { questions, concerns } = await body(req, z.object({ questions: z.array(z.string().max(500)).max(12), concerns: z.string().max(2000).nullish() }));
  await updateSummaryQuestions(userId, params.id, questions, concerns);
});
