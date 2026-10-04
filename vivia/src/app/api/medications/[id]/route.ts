import { withUser, body } from "@/server/http";
import { z } from "zod";
import { medicationSchema } from "@/lib/schemas";
import { updateMedication, setMedicationActive } from "@/server/services/medications";

export const PUT = withUser<{ id: string }>(async ({ req, userId, params }) => {
  await updateMedication(userId, params.id, await body(req, medicationSchema));
});

export const PATCH = withUser<{ id: string }>(async ({ req, userId, params }) => {
  const { active } = await body(req, z.object({ active: z.boolean() }));
  await setMedicationActive(userId, params.id, active);
});
