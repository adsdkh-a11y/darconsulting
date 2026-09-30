"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "./I18n";
import { api } from "@/lib/api";
import { Button, Field, Input, Notice } from "./ui";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [consentHealthData, setHealth] = useState(false);
  const [consentTerms, setTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === "register") {
        await api("/api/auth/register", "POST", { email, password, locale, consentHealthData, consentTerms });
        router.push("/onboarding");
      } else {
        const r = await api<{ next: string }>("/api/auth/login", "POST", { email, password });
        router.push(r.next);
      }
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-1" noValidate={false}>
      <Field label={t("auth.email")} htmlFor="email">
        <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </Field>
      <Field label={t("auth.password")} hint={mode === "register" ? t("auth.passwordHint") : undefined} htmlFor="password">
        <Input id="password" type="password" autoComplete={mode === "register" ? "new-password" : "current-password"} required minLength={mode === "register" ? 10 : undefined} value={password} onChange={(e) => setPassword(e.target.value)} />
      </Field>
      {mode === "register" && (
        <div className="space-y-3 py-2">
          <label className="flex gap-3 text-sm">
            <input type="checkbox" className="mt-1 size-5 shrink-0 accent-[var(--primary)]" checked={consentHealthData} onChange={(e) => setHealth(e.target.checked)} required />
            <span>{t("auth.consentHealth")}</span>
          </label>
          <label className="flex gap-3 text-sm">
            <input type="checkbox" className="mt-1 size-5 shrink-0 accent-[var(--primary)]" checked={consentTerms} onChange={(e) => setTerms(e.target.checked)} required />
            <span>{t("auth.consentTerms")}</span>
          </label>
          <Notice tone="primary">{t("auth.privacyNote")}</Notice>
        </div>
      )}
      {error && <p role="alert" className="py-2 text-sm font-medium text-danger">{error}</p>}
      <Button type="submit" className="mt-3 w-full" disabled={busy || (mode === "register" && (!consentHealthData || !consentTerms))}>
        {mode === "register" ? t("auth.register") : t("auth.login")}
      </Button>
      <p className="pt-4 text-center text-sm">
        {mode === "login" ? <Link className="font-semibold text-primary" href="/register">{t("auth.noAccount")}</Link> : <Link className="font-semibold text-primary" href="/login">{t("auth.haveAccount")}</Link>}
      </p>
    </form>
  );
}
