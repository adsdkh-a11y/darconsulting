import { beforeEach } from "vitest";
import { TEST_DB } from "./env";

process.env.DATABASE_URL = TEST_DB;
process.env.VIVIA_ENCRYPTION_KEY = Buffer.alloc(32, 7).toString("base64");
process.env.STORAGE_DIR = "./.data/test-storage";
process.env.AI_PROVIDER = "rules";

beforeEach(async () => {
  const { prisma } = await import("@/server/db");
  const tables = await prisma.$queryRaw<{ tablename: string }[]>`SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename <> '_prisma_migrations'`;
  await prisma.$executeRawUnsafe(`TRUNCATE ${tables.map((t) => `"${t.tablename}"`).join(", ")} CASCADE`);
});
