import { withUser, body } from "@/server/http";
import { medicationSchema } from "@/lib/schemas";
import { createMedication } from "@/server/services/medications";

export const POST = withUser(async ({ req, userId }) => {
  const m = await createMedication(userId, await body(req, medicationSchema));
  return { id: m.id };
});
