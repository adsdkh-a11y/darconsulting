import { requirePageUser } from "@/server/session";
import { getT } from "@/server/locale";
import { getDocument } from "@/server/services/documents";
import { PageHeader } from "@/components/ui";
import { ExtractionReview } from "@/components/ExtractionReview";

export default async function Review({ params }: { params: Promise<{ id: string }> }) {
  const user = await requirePageUser();
  const { id } = await params;
  const { t } = await getT();
  const doc = await getDocument(user.id, id);
  const fields = doc.extractions[0]?.fields ?? [];
  return (
    <div>
      <PageHeader title={t("rev.title")} subtitle={t("rev.subtitle")} back={`/documents/${doc.id}`} />
      <p className="mb-3 text-sm text-muted">📄 {doc.title} · <a className="font-semibold text-primary" href={`/api/documents/${doc.id}/file`} target="_blank" rel="noreferrer">{t("doc.open")} ↗</a></p>
      <ExtractionReview documentId={doc.id} fields={fields.map((f) => ({ id: f.id, kind: f.kind, key: f.key, label: f.label, value: f.value, unit: f.unit, editedValue: f.editedValue, confidence: f.confidence, sourceSnippet: f.sourceSnippet, status: f.status, applied: !!f.appliedEntity }))} />
    </div>
  );
}
