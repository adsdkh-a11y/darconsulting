import { execSync } from "node:child_process";
import { TEST_DB } from "./env";

export default function setup() {
  execSync("npx prisma migrate reset --force --skip-seed --skip-generate", {
    env: { ...process.env, DATABASE_URL: TEST_DB, PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION: "yes" },
    stdio: "inherit",
  });
}
