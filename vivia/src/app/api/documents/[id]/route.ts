import { withUser } from "@/server/http";
import { deleteDocument } from "@/server/services/documents";

export const DELETE = withUser<{ id: string }>(async ({ userId, params }) => {
  await deleteDocument(userId, params.id);
});
