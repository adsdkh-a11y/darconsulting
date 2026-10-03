import { describe, expect, it } from "vitest";
import { en } from "@/lib/i18n/en";
import { it as itDict } from "@/lib/i18n/it";
import { fr } from "@/lib/i18n/fr";
import { es } from "@/lib/i18n/es";
import { de } from "@/lib/i18n/de";
import { ar } from "@/lib/i18n/ar";

const placeholders = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join(",");

describe("i18n", () => {
  const dicts = { it: itDict, fr, es, de, ar } as Record<string, Record<string, string | undefined>>;
  for (const [name, dict] of Object.entries(dicts)) {
    it(`${name} covers every key and keeps placeholders`, () => {
      const missing = Object.keys(en).filter((k) => !dict[k]);
      expect(missing).toEqual([]);
      const broken = Object.entries(en).filter(([k, v]) => placeholders(v) !== placeholders(dict[k] ?? ""));
      expect(broken.map(([k]) => k)).toEqual([]);
    });
  }
});
