import { redirect } from "next/navigation";
import { currentUser } from "@/server/session";
import { getT } from "@/server/locale";
import { AuthForm } from "@/components/AuthForm";
import { PageHeader } from "@/components/ui";

export default async function Page() {
  if (await currentUser()) redirect("/home");
  const { t } = await getT();
  return (
    <main className="mx-auto max-w-md px-5 py-6">
      <PageHeader title={t("auth.register")} back="/welcome" />
      <AuthForm mode="register" />
    </main>
  );
}
