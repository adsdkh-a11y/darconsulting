"use client";
import { useRouter } from "next/navigation";
import { useI18n } from "./I18n";
import { api } from "@/lib/api";
import { Button } from "./ui";

export function ResolveConflict({ id, awaitingDoctor }: { id: string; awaitingDoctor: boolean }) {
  const { t } = useI18n();
  const router = useRouter();
  const go = async (resolution: string) => {
    await api(`/api/conflicts/${id}`, "POST", { resolution });
    router.refresh();
  };
  return (
    <div className="mt-3 grid gap-2">
      <div className="grid grid-cols-2 gap-2">
        <Button variant="secondary" onClick={() => go("KEEP_EXISTING")}>{t("conf.keepExisting")}</Button>
        <Button onClick={() => go("KEEP_NEW")}>{t("conf.keepNew")}</Button>
      </div>
      {!awaitingDoctor && <Button variant="ghost" onClick={() => go("NEEDS_DOCTOR_CONFIRMATION")}>{t("conf.doctor")}</Button>}
    </div>
  );
}
