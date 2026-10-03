import { withUser } from "@/server/http";
import { getSummary } from "@/server/services/summary";
import { renderSummaryPdf } from "@/server/services/summaryPdf";
import { audit } from "@/server/audit";

export const GET = withUser<{ id: string }>(async ({ userId, params }) => {
  const s = await getSummary(userId, params.id);
  const pdf = await renderSummaryPdf(s.content);
  await audit(userId, "summary.pdf_exported", "VisitSummary", s.id);
  return new Response(new Uint8Array(pdf), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="vivia-care-summary-${s.content.period.end}.pdf"`,
      "cache-control": "private, no-store",
    },
  });
});
