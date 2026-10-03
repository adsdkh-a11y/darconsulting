import { redirect } from "next/navigation";
import { currentUser } from "@/server/session";
import { Splash } from "@/components/Splash";

export default async function Root() {
  const user = await currentUser();
  if (user) redirect("/home");
  return <Splash />;
}
