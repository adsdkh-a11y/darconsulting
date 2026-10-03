import { requirePageUser } from "@/server/session";
import { getProfile } from "@/server/services/profile";
import { getT } from "@/server/locale";
import { PageHeader } from "@/components/ui";
import { MapExplorer } from "@/components/MapExplorer";

export default async function MapPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const user = await requirePageUser();
  const profile = await getProfile(user.id);
  const { t } = await getT();
  const { category } = await searchParams;
  return (
    <div>
      <PageHeader title={t("map.title")} subtitle={t("map.subtitle")} />
      <MapExplorer stoma={!!profile?.hasStoma} initialCategory={category ?? "BATHROOM"} />
    </div>
  );
}
