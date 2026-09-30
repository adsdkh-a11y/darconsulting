"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "./I18n";
import { api } from "@/lib/api";
import { Button } from "./ui";
import { localDay } from "@/lib/clientDate";

/** Normal days should take one tap. */
export function GoodDayButton({ className }: { className?: string }) {
  const { t } = useI18n();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <Button
      variant="accent"
      className={className}
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await api("/api/symptoms", "POST", { date: localDay(), overall: 5 });
        router.refresh();
      }}
    >
      ☀️ {t("log.goodDay")}
    </Button>
  );
}
