import { withUser } from "@/server/http";
import { explainDocumentTerms } from "@/server/services/explain";

export const POST = withUser<{ id: string }>(async ({ userId, params }) => explainDocumentTerms(userId, params.id));
