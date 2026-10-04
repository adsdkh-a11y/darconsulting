import { withUser, body } from "@/server/http";
import { z } from "zod";
import { cancelLog } from "@/server/services/naturalLog";

export const POST = withUser(async ({ req, userId }) => {
  const { runId } = await body(req, z.object({ runId: z.string().uuid() }));
  await cancelLog(userId, runId);
});
