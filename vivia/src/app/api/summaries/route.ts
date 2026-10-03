import { withUser, body } from "@/server/http";
import { summaryRequestSchema } from "@/lib/schemas";
import { generateSummary } from "@/server/services/summary";
import { prisma } from "@/server/db";

export const POST = withUser(async ({ req, userId }) => {
  const input = await body(req, summaryRequestSchema);
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { locale: true } });
  const s = await generateSummary(userId, { ...input, locale: user.locale });
  return { id: s.id };
});
