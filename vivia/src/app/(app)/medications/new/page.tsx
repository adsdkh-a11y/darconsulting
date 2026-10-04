import { getT } from "@/server/locale";
import { PageHeader } from "@/components/ui";
import { MedicationForm } from "@/components/MedicationForm";

export default async function NewMedication() {
  const { t } = await getT();
  return (
    <div>
      <PageHeader title={t("med.add")} back="/medications" />
      <MedicationForm />
    </div>
  );
}
