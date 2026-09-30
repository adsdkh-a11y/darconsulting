import { withUser, body } from "@/server/http";
import { emergencyCardSchema } from "@/lib/schemas";
import { saveEmergencyCard, emergencyCardView } from "@/server/services/emergency";

export const PUT = withUser(async ({ req, userId }) => {
  await saveEmergencyCard(userId, await body(req, emergencyCardSchema));
  return emergencyCardView(userId);
});
