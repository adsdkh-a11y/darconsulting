import { withUser, body } from "@/server/http";
import { z } from "zod";
import { createShareLink } from "@/server/services/summary";

export const POST = withUser<{ id: string }>(async ({ req, userId, params }) => {
  const { days } = await body(req, z.object({ days: z.coerce.number().int().min(1).max(30) }));
  const { token, link } = await createShareLink(userId, params.id, days);
  const origin = req.headers.get("origin") ?? new URL(req.url).origin;
  return { url: `${origin}/share/${token}`, id: link.id, expiresAt: link.expiresAt };
});
