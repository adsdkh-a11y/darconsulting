import { withUser, body } from "@/server/http";
import { fieldReviewSchema } from "@/lib/schemas";
import { reviewField } from "@/server/services/documents";

export const POST = withUser<{ id: string; fieldId: string }>(async ({ req, userId, params }) => {
  const { action, editedValue } = await body(req, fieldReviewSchema);
  const f = await reviewField(userId, params.fieldId, action, editedValue);
  return { status: f.status };
});
