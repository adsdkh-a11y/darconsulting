import { withUser, body } from "@/server/http";
import { z } from "zod";
import { interpretLog } from "@/server/services/naturalLog";

export const POST = withUser(async ({ req, userId }) => {
  const { text, today } = await body(req, z.object({ text: z.string().max(2000), today: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional() }));
  return interpretLog(userId, text, today);
});
