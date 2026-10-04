"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "./I18n";
import { api } from "@/lib/api";
import { Notice } from "./ui";
import { Icon } from "./Icon";

export function UploadDocument() {
  const { t } = useI18n();
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(file: File) {
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await api<{ id: string; status: string }>("/api/documents", "POST", fd);
      router.push(r.status === "NEEDS_REVIEW" ? `/documents/${r.id}/review` : `/documents/${r.id}`);
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  }

  return (
    <div>
      <button type="button" disabled={busy} onClick={() => input.current?.click()}
        className="tap flex w-full flex-col items-center gap-1 rounded-3xl border-2 border-dashed border-primary/40 bg-primary-soft px-4 py-6 text-center">
        <Icon name={busy ? "refresh" : "file"} className={`size-8 ${busy ? "animate-spin" : ""}`} />
        <span className="font-semibold text-primary">{busy ? t("doc.uploading") : t("doc.upload")}</span>
        <span className="text-sm text-ink-2">{t("doc.uploadHint")}</span>
      </button>
      <input ref={input} type="file" accept="application/pdf,image/jpeg,image/png" capture="environment" className="sr-only" aria-label={t("doc.upload")}
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
      {error && <div className="mt-3"><Notice tone="warn">{error}</Notice></div>}
    </div>
  );
}
