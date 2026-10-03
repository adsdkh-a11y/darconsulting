import { requirePageUser } from "@/server/session";
import { getT } from "@/server/locale";
import { listConflicts } from "@/server/services/conflicts";
import { Card, PageHeader, Pill } from "@/components/ui";
import { ResolveConflict } from "@/components/ResolveConflict";
import { fmtDay } from "@/lib/dates";
import type { DictKey } from "@/lib/i18n";

export default async function Conflicts() {
  const user = await requirePageUser();
  const { t, locale } = await getT();
  const all = await listConflicts(user.id, "ALL");
  const open = all.filter((c) => c.status === "OPEN" || c.status === "NEEDS_DOCTOR_CONFIRMATION");
  return (
    <div>
      <PageHeader title={t("conf.title")} subtitle={t("conf.subtitle")} back="/me" />
      {open.length === 0 && <Card><p className="text-ink-2">{t("conf.none")}</p></Card>}
      <div className="space-y-3">
        {open.map((c) => (
          <Card key={c.id}>
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold">{c.field}</p>
              {c.status === "NEEDS_DOCTOR_CONFIRMATION" && <Pill tone="warn">{t("conf.pendingDoctor")}</Pill>}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-2xl bg-surface-2 p-3">
                <p className="text-xs text-muted">{t("conf.existing")}</p>
                <p className="font-semibold">{c.existingValue}</p>
              </div>
              <div className="rounded-2xl bg-accent-soft p-3">
                <p className="text-xs text-muted">{t("conf.new")} · {t(`source.${c.newSourceType}` as DictKey)}</p>
                <p className="font-semibold">{c.newValue}</p>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted">{fmtDay(c.createdAt, locale)}</p>
            <ResolveConflict id={c.id} awaitingDoctor={c.status === "NEEDS_DOCTOR_CONFIRMATION"} />
          </Card>
        ))}
      </div>
    </div>
  );
}
