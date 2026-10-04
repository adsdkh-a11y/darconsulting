import type { Prisma } from "@prisma/client";
import { prisma } from "./db";

/** Append-only access/audit trail. Never store health values in metadata. */
export async function audit(
  userId: string,
  action: string,
  entity?: string,
  entityId?: string,
  metadata?: Prisma.InputJsonValue,
) {
  await prisma.auditLog.create({ data: { userId, action, entity, entityId, metadata } });
}
