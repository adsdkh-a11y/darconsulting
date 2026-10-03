import { getT } from "@/server/locale";
import { PageHeader } from "@/components/ui";
import { TellVivia } from "@/components/TellVivia";

export default async function TellPage() {
  const { t } = await getT();
  return (
    <div>
      <PageHeader title={t("tell.title")} subtitle={t("tell.subtitle")} back="/log" />
      <TellVivia />
    </div>
  );
}
