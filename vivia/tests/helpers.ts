import { registerUser } from "@/server/auth";
import { completeOnboarding } from "@/server/services/profile";

let n = 0;
export async function makeUser(opts: { disease?: "CROHNS" | "ULCERATIVE_COLITIS"; hasStoma?: boolean } = {}) {
  n++;
  const user = await registerUser({ email: `user${n}-${Date.now()}@example.test`, password: "correct horse battery", consentHealthData: true, consentTerms: true });
  await completeOnboarding(user.id, { displayName: `Patient ${n}`, disease: opts.disease ?? "CROHNS", hasStoma: opts.hasStoma ?? false });
  return user;
}
