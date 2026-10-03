import { withUser } from "@/server/http";
import { exportUserData } from "@/server/services/privacy";

export const GET = withUser(async ({ userId }) => {
  const data = await exportUserData(userId);
  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      "content-type": "application/json",
      "content-disposition": `attachment; filename="vivia-export-${new Date().toISOString().slice(0, 10)}.json"`,
      "cache-control": "private, no-store",
    },
  });
});
