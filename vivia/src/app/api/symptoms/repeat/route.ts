import { withUser, body } from "@/server/http";
import { z } from "zod";
import { repeatYesterday } from "@/server/services/symptoms";
import { badRequest } from "@/server/errors";

export const POST = withUser(async ({ req, userId }) => {
  const { date } = await body(req, z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional() }));
  const e = await repeatYesterday(userId, date);
  if (!e) throw badRequest("There is no previous check-in to repeat yet");
  return { id: e.id };
});
