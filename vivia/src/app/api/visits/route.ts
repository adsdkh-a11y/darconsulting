import { withUser, body } from "@/server/http";
import { visitSchema } from "@/lib/schemas";
import { createVisit } from "@/server/services/visits";

export const POST = withUser(async ({ req, userId }) => ({ id: (await createVisit(userId, await body(req, visitSchema))).id }));
