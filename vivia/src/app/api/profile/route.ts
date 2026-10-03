import { withUser, body } from "@/server/http";
import { profileUpdateSchema } from "@/lib/schemas";
import { updateProfile } from "@/server/services/profile";

export const PATCH = withUser(async ({ req, userId }) => {
  await updateProfile(userId, await body(req, profileUpdateSchema));
});
