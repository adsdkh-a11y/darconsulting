import { withUser } from "@/server/http";
import { revokeShareLink } from "@/server/services/summary";

export const DELETE = withUser<{ id: string }>(async ({ userId, params }) => {
  await revokeShareLink(userId, params.id);
});
