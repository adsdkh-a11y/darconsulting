import { requirePageUser } from "@/server/session";
import { getT } from "@/server/locale";
import { prisma } from "@/server/db";
import { currentConsents } from "@/server/services/privacy";
import { Card, PageHeader, Pill, SectionTitle } from "@/components/ui";
import { ConsentToggle, DataRights } from "@/components/PrivacyControls";
import { fmtDay } from "@/lib/dates";
import type { DictKey } from "@/lib/i18n";

const SHOWN = ["HEALTH_DATA_PROCESSING", "AI_PROCESSING", "DOCUMENT_AI_PROCESSING", "PRODUCT_ANALYTICS"] as const;

export default async function Privacy() {
  const user = await requirePageUser();
  const { t, locale } = await getT();
  const [consents, runs, logs] = await Promise.all([
    currentConsents(user.id),
    prisma.aiRun.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 10 }),
    prisma.auditLog.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 15 }),
  ]);
  return (
    <div>
      <PageHeader title={t("priv.title")} subtitle={t("priv.subtitle")} back="/me" />
      <Card className="py-1">
        {SHOWN.map((c) => (
          <ConsentToggle key={c} type={c} granted={!!consents[c]?.granted} locked={c === "HEALTH_DATA_PROCESSING"}
            label={t(`priv.c.${c}` as DictKey)} description={t(`priv.c.${c}.d` as DictKey)} />
        ))}
        <div className="py-3">
          <p className="font-semibold">📍 {t("priv.c.LOCATION_ON_REQUEST")}</p>
          <p className="text-sm text-ink-2">{t("priv.c.LOCATION_ON_REQUEST.d")}</p>
        </div>
      </Card>
      <SectionTitle>{t("priv.aiHistory")}</SectionTitle>
      <Card>
        <p className="mb-2 text-sm text-ink-2">{t("priv.aiHistoryHint")}</p>
        {runs.length === 0 ? <p className="text-muted">—</p> : (
          <ul className="divide-y divide-line text-sm">
            {runs.map((r) => (
              <li key={r.id} className="py-2">
                <span className="font-medium">{r.task.toLowerCase().replace(/_/g, " ")}</span> · {r.provider}/{r.model} · {fmtDay(r.createdAt, locale)}
                {r.userConfirmed === true && <Pill tone="primary" className="ms-1">✓</Pill>}
                {r.safetyFlags.length > 0 && <span className="block text-xs text-muted">🛡 {r.safetyFlags.join(", ")}</span>}
                <span className="block text-xs text-muted">{JSON.stringify(r.inputScope)}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
      <SectionTitle>{t("priv.audit")}</SectionTitle>
      <Card>
        <ul className="divide-y divide-line text-sm">
          {logs.map((l) => <li key={l.id} className="flex justify-between py-1.5"><span>{l.action}</span><span className="text-muted">{l.createdAt.toLocaleString(locale)}</span></li>)}
        </ul>
      </Card>
      <DataRights />
      <SectionTitle>{t("priv.notDoctor")}</SectionTitle>
      <Card><p className="text-sm text-ink-2">{t("app.notDoctor")}</p></Card>
    </div>
  );
}
