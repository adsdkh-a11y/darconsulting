import type { Metadata } from "next";
import { readSharedSummary } from "@/server/services/summary";
import { getT } from "@/server/locale";
import { SummaryView } from "@/components/SummaryView";

export const metadata: Metadata = { title: "VIVIA Care Summary", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function Shared({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const { t, locale } = await getT();
  const s = await readSharedSummary(token);
  return (
    <main className="mx-auto max-w-2xl px-4 py-6">
      <p className="font-display text-xl font-semibold text-primary">VIVIA</p>
      {s ? (
        <>
          <h1 className="mb-1 mt-2 font-display text-3xl">{t("sum.title")}</h1>
          <p className="mb-4 text-sm text-muted">{t("sum.shareHint")} {t("sum.expires", { date: s.expiresAt.toLocaleDateString(locale) })}</p>
          <SummaryView c={s.content} t={t} />
        </>
      ) : (
        <p className="mt-10 text-lg">This link has expired or was revoked by the patient.</p>
      )}
    </main>
  );
}
