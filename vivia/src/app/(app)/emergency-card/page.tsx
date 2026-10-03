import { requirePageUser } from "@/server/session";
import { getT } from "@/server/locale";
import { emergencyCardView } from "@/server/services/emergency";
import { PageHeader } from "@/components/ui";
import { EmergencyCardEditor } from "@/components/EmergencyCard";

export default async function EmergencyCardPage() {
  const user = await requirePageUser();
  const { t } = await getT();
  const view = await emergencyCardView(user.id);
  return (
    <div>
      <PageHeader title={t("ec.title")} subtitle={t("ec.subtitle")} back="/me" />
      <EmergencyCardEditor initial={view} />
    </div>
  );
}
