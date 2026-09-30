import { withUser, body } from "@/server/http";
import { clinicalEventSchema } from "@/lib/schemas";
import { addClinicalEvent } from "@/server/services/clinical";

export const POST = withUser(async ({ req, userId }) => ({ id: (await addClinicalEvent(userId, await body(req, clinicalEventSchema))).id }));
