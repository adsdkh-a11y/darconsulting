import { withUser, body } from "@/server/http";
import { reportSchema } from "@/lib/schemas";
import { reportLocation } from "@/server/services/locations";

export const POST = withUser<{ id: string }>(async ({ req, userId, params }) => {
  await reportLocation(userId, params.id, await body(req, reportSchema));
});
