import { withUser, body } from "@/server/http";
import { z } from "zod";
import { deleteAccount } from "@/server/services/privacy";
import { clearSessionCookie } from "@/server/session";
import { badRequest } from "@/server/errors";

export const POST = withUser(async ({ req, userId }) => {
  const { confirm } = await body(req, z.object({ confirm: z.string() }));
  if (confirm !== "DELETE") throw badRequest("Type DELETE to confirm");
  await deleteAccount(userId);
  await clearSessionCookie();
});
