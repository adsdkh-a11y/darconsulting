import Link from "next/link";
import { redirect } from "next/navigation";
import { requirePageUser } from "@/server/session";
import { getProfile } from "@/server/services/profile";
import { getT } from "@/server/locale";
import { BottomNav } from "@/components/BottomNav";
import { BathroomButton } from "@/components/BathroomButton";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requirePageUser();
  const profile = await getProfile(user.id);
  if (!profile?.onboardingCompleted) redirect("/onboarding");
  const { t } = await getT();
  return (
    <div className="mx-auto min-h-dvh max-w-md px-4 pb-28">
      <div className="sticky top-0 z-20 -mx-4 flex items-center justify-between bg-bg/90 px-4 py-3 backdrop-blur">
        <Link href="/home" className="font-display text-xl font-semibold tracking-wide text-primary">
          VIVIA
        </Link>
        <BathroomButton label={t("nav.bathroom")} />
      </div>
      <main id="main">{children}</main>
      <BottomNav />
    </div>
  );
}
