import { withUser, body } from "@/server/http";
import { consentSchema } from "@/lib/schemas";
import { setConsent } from "@/server/services/privacy";

export const POST = withUser(async ({ req, userId }) => {
  const { type, granted } = await body(req, consentSchema);
  await setConsent(userId, type, granted);
});
