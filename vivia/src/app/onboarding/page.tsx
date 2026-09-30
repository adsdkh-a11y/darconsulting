import { redirect } from "next/navigation";
import { currentUser } from "@/server/session";
import { getProfile } from "@/server/services/profile";
import { Onboarding } from "@/components/Onboarding";

export default async function Page() {
  const user = await currentUser();
  if (!user) redirect("/login");
  const p = await getProfile(user.id);
  if (p?.onboardingCompleted) redirect("/home");
  return <Onboarding />;
}
