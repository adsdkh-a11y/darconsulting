import Link from "next/link";
import { getT } from "@/server/locale";
import { ButtonLink } from "@/components/ui";
import { LanguagePicker } from "@/components/LanguagePicker";

export default async function Welcome() {
  const { t, locale } = await getT();
  const values = ["auth.value1", "auth.value2", "auth.value3", "auth.value4"] as const;
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-5 pb-8 pt-6">
      <div className="flex items-center justify-between">
        <span className="font-display text-2xl font-semibold text-primary">VIVIA</span>
        <LanguagePicker current={locale} />
      </div>
      <div className="mt-10 flex-1">
        <h1 className="font-display text-4xl leading-tight">{t("auth.welcomeTitle")}</h1>
        <p className="mt-4 text-lg text-ink-2">{t("auth.welcomeBody")}</p>
        <ul className="mt-8 space-y-3">
          {values.map((v) => (
            <li key={v} className="flex items-start gap-3">
              <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-primary-soft text-sm text-primary" aria-hidden>✓</span>
              <span>{t(v)}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-10 space-y-3">
        <ButtonLink href="/register" className="w-full text-lg">{t("auth.getStarted")}</ButtonLink>
        <ButtonLink href="/login" variant="secondary" className="w-full">{t("auth.haveAccount")}</ButtonLink>
        <Link href="/bathroom" className="tap flex w-full items-center justify-center gap-2 rounded-2xl bg-accent-soft px-5 py-3 font-semibold text-accent">
          <span aria-hidden>🚻</span> {t("auth.bathroomNoAccount")}
        </Link>
        <p className="pt-2 text-center text-xs text-muted">{t("app.notDoctor")}</p>
      </div>
    </main>
  );
}
