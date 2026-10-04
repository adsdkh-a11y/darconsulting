import { requirePageUser } from "@/server/session";
import { getProfile } from "@/server/services/profile";
import { getT } from "@/server/locale";
import { PageHeader } from "@/components/ui";
import { QuickCheckin } from "@/components/QuickCheckin";

export default async function LogPage() {
  const user = await requirePageUser();
  const profile = await getProfile(user.id);
  const { t } = await getT();
  return (
    <div>
      <PageHeader title={t("log.title")} subtitle={t("log.subtitle")} />
      <QuickCheckin tracked={profile?.trackedSymptoms ?? []} hasStoma={!!profile?.hasStoma} />
    </div>
  );
}
