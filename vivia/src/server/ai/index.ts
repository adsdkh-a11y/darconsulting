import { prisma } from "../db";
import type { AiTask, Prisma } from "@prisma/client";
import type { AIProvider } from "./types";
import { RulesProvider } from "./rules";
import { AnthropicProvider } from "./anthropic";

export * from "./types";

const rules = new RulesProvider();
let llm: AIProvider | null | undefined;

function configuredLLM(): AIProvider | null {
  if (llm !== undefined) return llm;
  const mode = process.env.AI_PROVIDER ?? "auto";
  llm = mode === "anthropic" || (mode === "auto" && process.env.ANTHROPIC_API_KEY) ? new AnthropicProvider() : null;
  return llm;
}

/**
 * Choose the provider for a patient. Third-party AI is used ONLY when it is
 * configured AND the patient has an active consent for that purpose.
 */
export async function providerFor(userId: string, purpose: "AI_PROCESSING" | "DOCUMENT_AI_PROCESSING"): Promise<AIProvider> {
  const external = configuredLLM();
  if (!external) return rules;
  const consent = await prisma.consent.findFirst({ where: { userId, type: purpose }, orderBy: { createdAt: "desc" } });
  return consent?.granted ? external : rules;
}

export const offlineProvider = rules;

/**
 * Run an AI task with automatic fallback to the offline engine, and record an
 * audit row (model, time, input scope, output, source references).
 */
export async function runAI<T>(opts: {
  userId: string;
  task: AiTask;
  provider: AIProvider;
  inputScope: Prisma.InputJsonValue;
  sourceRefs?: string[];
  exec: (p: AIProvider) => Promise<T>;
  postprocess?: (out: T) => { output: T; flags: string[] };
}) {
  let provider = opts.provider;
  let out: T;
  const flags: string[] = [];
  try {
    out = await opts.exec(provider);
  } catch (err) {
    if (provider === rules) throw err;
    console.warn(`[ai] ${provider.name} failed for ${opts.task}, falling back to offline engine:`, (err as Error).message);
    flags.push("fell_back_to_offline_engine");
    provider = rules;
    out = await opts.exec(rules);
  }
  if (opts.postprocess) {
    const p = opts.postprocess(out);
    out = p.output;
    flags.push(...p.flags);
  }
  const run = await prisma.aiRun.create({
    data: {
      userId: opts.userId,
      task: opts.task,
      provider: provider.name,
      model: provider.model,
      inputScope: opts.inputScope,
      sourceRefs: opts.sourceRefs ?? [],
      output: JSON.parse(JSON.stringify(out)) as Prisma.InputJsonValue,
      safetyFlags: flags,
    },
  });
  return { output: out, run };
}

/** Test hook: re-read AI configuration from the environment. */
export function resetAIConfigForTests() {
  llm = undefined;
}
