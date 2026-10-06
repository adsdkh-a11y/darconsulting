import { requirePageUser } from "@/server/session";
import { getProfile } from "@/server/services/profile";
import { getT } from "@/server/locale";
import { MapExplorer } from "@/components/MapExplorer";

export default async function MapPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const user = await requirePageUser();
  const profile = await getProfile(user.id);
  const { t } = await getT();
  const { category } = await searchParams;
  return (
    <div>
      <h1 className="sr-only">{t("map.title")}</h1>
      <MapExplorer stoma={!!profile?.hasStoma} initialCategory={category ?? "BATHROOM"} />
    </div>
  );
}
