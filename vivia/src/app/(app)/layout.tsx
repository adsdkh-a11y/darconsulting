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
    <div className="mx-auto min-h-dvh max-w-md px-4 pb-32">
      <div className="sticky top-0 z-20 -mx-4 flex items-center justify-between bg-gradient-to-b from-bg from-70% to-transparent px-4 pb-2 pt-3">
        <Link href="/me" className="flex items-center gap-3" aria-label={t("prof.title")}>
          <span className="grid size-11 place-items-center rounded-full bg-gradient-to-br from-primary to-[#2a8c75] text-lg font-extrabold text-primary-ink">{profile.displayName.charAt(0).toUpperCase()}</span>
          <span className="font-display text-xl font-extrabold tracking-[0.04em] text-ink">VIVIA</span>
        </Link>
        <BathroomButton label={t("nav.bathroom")} />
      </div>
      <main id="main">{children}</main>
      <BottomNav />
    </div>
  );
}
