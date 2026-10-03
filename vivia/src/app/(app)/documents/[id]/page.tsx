import Link from "next/link";
import { requirePageUser } from "@/server/session";
import { getT } from "@/server/locale";
import { getDocument } from "@/server/services/documents";
import { ButtonLink, Card, PageHeader, Pill, SectionTitle } from "@/components/ui";
import { ExplainTerms, DeleteDocument } from "@/components/DocumentTools";
import { fmtDay } from "@/lib/dates";
import type { DictKey } from "@/lib/i18n";

export default async function DocumentDetail({ params }: { params: Promise<{ id: string }> }) {
  const user = await requirePageUser();
  const { id } = await params;
  const { t, locale } = await getT();
  const doc = await getDocument(user.id, id);
  const ex = doc.extractions[0];
  const kept = ex?.fields.filter((f) => f.status === "CONFIRMED" || f.status === "EDITED") ?? [];
  return (
    <div>
      <PageHeader title={doc.title} back="/documents" subtitle={`${t(`doc.type.${doc.type}` as DictKey)} · ${fmtDay(doc.documentDate ?? doc.createdAt, locale)}`} />
      <div className="mb-4 flex flex-wrap gap-2">
        <Pill tone={doc.status === "NEEDS_REVIEW" ? "accent" : "neutral"}>{t(`doc.status.${doc.status}` as DictKey)}</Pill>
        <Link href={`/api/documents/${doc.id}/file`} target="_blank" className="text-sm font-semibold text-primary">{t("doc.open")} ↗</Link>
      </div>
      {doc.status === "NEEDS_REVIEW" && <ButtonLink href={`/documents/${doc.id}/review`} className="mb-4 w-full">{t("doc.review")}</ButtonLink>}

      <SectionTitle>{t("doc.says")}</SectionTitle>
      <Card>
        <p className="mb-2 text-xs uppercase tracking-wider text-muted">{t("doc.saysHint")}</p>
        {ex?.summary ? <p>{ex.summary}</p> : <p className="text-ink-2">{t("doc.noText")}</p>}
        {kept.length > 0 && (
          <dl className="mt-4 divide-y divide-line">
            {kept.map((f) => (
              <div key={f.id} className="py-2">
                <dt className="text-sm text-muted">{f.label}</dt>
                <dd className="font-medium">{f.editedValue ?? f.value}{f.unit ? ` ${f.unit}` : ""} {f.status === "EDITED" && <Pill>{t("rev.status.EDITED")}</Pill>}</dd>
              </div>
            ))}
          </dl>
        )}
        {doc.status === "FAILED" && <p className="mt-2 text-sm text-warn">{doc.failureReason}</p>}
      </Card>

      <SectionTitle>{t("doc.understand")}</SectionTitle>
      <Card>
        <p className="mb-3 text-sm text-ink-2">{t("doc.understandHint")}</p>
        <ExplainTerms id={doc.id} />
      </Card>
      <DeleteDocument id={doc.id} />
    </div>
  );
}
