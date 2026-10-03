import { withUser, body } from "@/server/http";
import { onboardingSchema } from "@/lib/schemas";
import { completeOnboarding } from "@/server/services/profile";

export const POST = withUser(async ({ req, userId }) => {
  await completeOnboarding(userId, await body(req, onboardingSchema));
});
