import { requirePageUser } from "@/server/session";
import { getT } from "@/server/locale";
import { listDocuments } from "@/server/services/documents";
import { Card, ListLink, PageHeader, Pill } from "@/components/ui";
import { UploadDocument } from "@/components/UploadDocument";
import { fmtDay } from "@/lib/dates";
import type { DictKey } from "@/lib/i18n";

const ICON: Record<string, string> = { COLONOSCOPY: "🔬", HISTOLOGY: "🧫", MRI: "🧲", CT: "🩻", ULTRASOUND: "📡", BLOOD_TEST: "🧪", CALPROTECTIN: "🧪", PRESCRIPTION: "💊", DISCHARGE_LETTER: "🏥", SURGERY_REPORT: "🏥" };

export default async function Documents() {
  const user = await requirePageUser();
  const { t, locale } = await getT();
  const docs = await listDocuments(user.id);
  return (
    <div>
      <PageHeader title={t("doc.title")} subtitle={t("doc.subtitle")} />
      <UploadDocument />
      <Card className="mt-5 py-1">
        {docs.length === 0 ? <p className="py-4 text-ink-2">{t("doc.empty")}</p> : docs.map((d) => (
          <ListLink key={d.id} href={d.status === "NEEDS_REVIEW" ? `/documents/${d.id}/review` : `/documents/${d.id}`} icon={ICON[d.type] ?? "📄"}
            title={d.title}
            detail={`${t(`doc.type.${d.type}` as DictKey)} · ${fmtDay(d.documentDate ?? d.createdAt, locale)}`}
            right={<Pill tone={d.status === "NEEDS_REVIEW" ? "accent" : d.status === "FAILED" ? "warn" : "neutral"}>{t(`doc.status.${d.status}` as DictKey)}</Pill>} />
        ))}
      </Card>
    </div>
  );
}
