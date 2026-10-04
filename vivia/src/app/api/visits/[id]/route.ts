import { withUser, body } from "@/server/http";
import { z } from "zod";
import { updateVisitConcerns, deleteVisit } from "@/server/services/visits";

export const PATCH = withUser<{ id: string }>(async ({ req, userId, params }) => {
  const { patientConcerns, completed } = await body(req, z.object({ patientConcerns: z.string().max(2000).nullable(), completed: z.boolean().optional() }));
  await updateVisitConcerns(userId, params.id, patientConcerns, completed);
});

export const DELETE = withUser<{ id: string }>(async ({ userId, params }) => {
  await deleteVisit(userId, params.id);
});
