"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "./I18n";
import { api } from "@/lib/api";
import { Button } from "./ui";
import { Icon } from "./Icon";

export function ExplainTerms({ id }: { id: string }) {
  const { t } = useI18n();
  const [items, setItems] = useState<{ term: string; explanation: string }[] | null>(null);
  const [busy, setBusy] = useState(false);
  if (items)
    return items.length ? (
      <dl className="space-y-3">
        {items.map((i) => (
          <div key={i.term}>
            <dt className="font-semibold">{i.term}</dt>
            <dd className="text-ink-2">{i.explanation}</dd>
          </div>
        ))}
      </dl>
    ) : <p className="text-ink-2">—</p>;
  return (
    <Button variant="secondary" disabled={busy} onClick={async () => { setBusy(true); const r = await api<{ explanations: typeof items }>(`/api/documents/${id}/explain`); setItems(r.explanations ?? []); setBusy(false); }}>
      <Icon name="bulb" className="size-5" /> {busy ? t("common.loading") : t("doc.explain")}
    </Button>
  );
}

export function DeleteDocument({ id }: { id: string }) {
  const { t } = useI18n();
  const router = useRouter();
  return (
    <Button variant="danger" className="mt-8 w-full" onClick={async () => {
      if (!confirm(t("doc.deleteConfirm"))) return;
      await api(`/api/documents/${id}`, "DELETE");
      router.push("/documents");
      router.refresh();
    }}>{t("common.delete")}</Button>
  );
}
