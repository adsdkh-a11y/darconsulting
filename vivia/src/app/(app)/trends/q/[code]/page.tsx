import { notFound } from "next/navigation";
import { getT } from "@/server/locale";
import { getInstrument } from "@/server/services/questionnaires";
import { PageHeader, Notice } from "@/components/ui";
import { QuestionnaireForm } from "@/components/QuestionnaireForm";

export default async function Questionnaire({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const inst = getInstrument(code);
  if (!inst) notFound();
  const { t } = await getT();
  const { score: _s, ...rest } = inst;
  void _s;
  return (
    <div>
      <PageHeader title={inst.name} subtitle={`${inst.recallPeriod}. ${inst.note}`} back="/trends" />
      <QuestionnaireForm instrument={rest} />
      <div className="mt-4"><Notice>{t("tr.qNote")}</Notice></div>
    </div>
  );
}
