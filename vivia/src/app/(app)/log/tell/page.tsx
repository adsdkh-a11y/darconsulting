import Link from "next/link";
import { getT } from "@/server/locale";
import { TellVivia } from "@/components/TellVivia";

export default async function TellPage() {
  const { t } = await getT();
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-bg px-4 pb-10 pt-4">
      <div className="mx-auto max-w-md">
        <div className="relative mb-6 flex items-center justify-center">
          <Link href="/home" aria-label={t("common.close")} className="tap absolute start-0 grid size-11 place-items-center rounded-full border border-line bg-surface text-xl">✕</Link>
          <h1 className="font-display text-lg font-extrabold">{t("tell.title")}</h1>
        </div>
        <TellVivia />
        <p className="mt-6 text-center text-xs text-muted">{t("tell.subtitle")}</p>
        <p className="mt-2 text-center text-xs text-muted">{t("app.notDoctor")}</p>
      </div>
    </div>
  );
}
