import { withUser } from "@/server/http";
import { downloadDocument } from "@/server/services/documents";

export const GET = withUser<{ id: string }>(async ({ userId, params }) => {
  const { doc, data } = await downloadDocument(userId, params.id);
  return new Response(new Uint8Array(data), {
    headers: {
      "content-type": doc.mimeType,
      "content-disposition": `inline; filename="${encodeURIComponent(doc.fileName)}"`,
      "cache-control": "private, no-store",
      "x-content-type-options": "nosniff",
    },
  });
});
