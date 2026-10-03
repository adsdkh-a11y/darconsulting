import type { Metadata } from "next";
import { currentUser } from "@/server/session";
import { getProfile } from "@/server/services/profile";
import { BathroomFinder } from "@/components/BathroomFinder";

export const metadata: Metadata = { title: "VIVIA — Nearest bathroom" };

/** PUBLIC: no account screen, no questionnaire. */
export default async function Bathroom() {
  const user = await currentUser();
  const profile = user ? await getProfile(user.id) : null;
  return <BathroomFinder signedIn={!!user} stoma={!!profile?.hasStoma} />;
}
