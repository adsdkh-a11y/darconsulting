import { withUser } from "@/server/http";
import { applyReviewedFields } from "@/server/services/documents";

export const POST = withUser<{ id: string }>(async ({ userId, params }) => applyReviewedFields(userId, params.id));
