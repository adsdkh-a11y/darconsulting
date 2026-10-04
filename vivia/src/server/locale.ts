import "server-only";
import { cookies, headers } from "next/headers";
import { normalizeLocale, translator, type Locale } from "@/lib/i18n";
import { currentUser } from "./session";

export async function getLocale(): Promise<Locale> {
  const user = await currentUser();
  if (user) return normalizeLocale(user.locale);
  const c = (await cookies()).get("vivia_locale")?.value;
  if (c) return normalizeLocale(c);
  const accept = (await headers()).get("accept-language") ?? "";
  return normalizeLocale(accept.split(",")[0]);
}

export async function getT() {
  const locale = await getLocale();
  return { locale, t: translator(locale) };
}
