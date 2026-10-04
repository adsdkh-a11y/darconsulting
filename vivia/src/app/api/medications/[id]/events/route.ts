import { withUser, body } from "@/server/http";
import { medicationEventSchema } from "@/lib/schemas";
import { logMedicationEvent } from "@/server/services/medications";

export const POST = withUser<{ id: string }>(async ({ req, userId, params }) => {
  const e = await logMedicationEvent(userId, params.id, await body(req, medicationEventSchema));
  return { id: e.id };
});
