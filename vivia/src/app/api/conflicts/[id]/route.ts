import { withUser, body } from "@/server/http";
import { conflictResolutionSchema } from "@/lib/schemas";
import { resolveConflict } from "@/server/services/conflicts";

export const POST = withUser<{ id: string }>(async ({ req, userId, params }) => {
  const { resolution } = await body(req, conflictResolutionSchema);
  await resolveConflict(userId, params.id, resolution);
});
