import { withUser, body } from "@/server/http";
import { symptomSchema } from "@/lib/schemas";
import { logSymptoms } from "@/server/services/symptoms";

export const POST = withUser(async ({ req, userId }) => {
  const entry = await logSymptoms(userId, await body(req, symptomSchema));
  return { id: entry.id };
});
