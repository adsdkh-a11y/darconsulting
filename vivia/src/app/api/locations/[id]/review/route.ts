import { withUser, body } from "@/server/http";
import { reviewSchema } from "@/lib/schemas";
import { reviewLocation } from "@/server/services/locations";

export const POST = withUser<{ id: string }>(async ({ req, userId, params }) => {
  await reviewLocation(userId, params.id, await body(req, reviewSchema));
});
