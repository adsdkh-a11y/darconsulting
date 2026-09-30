import { withUser, body } from "@/server/http";
import { labSchema } from "@/lib/schemas";
import { addLab } from "@/server/services/clinical";

export const POST = withUser(async ({ req, userId }) => ({ id: (await addLab(userId, await body(req, labSchema))).id }));
