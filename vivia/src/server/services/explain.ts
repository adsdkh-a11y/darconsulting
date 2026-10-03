/**
 * "Help me understand" — a SEPARATE layer from "What your document says".
 * Explains what terms found in the document generally mean. Never interprets
 * the patient's own result.
 */
import { prisma } from "../db";
import { providerFor, runAI, type Explanation } from "../ai";
import { guardText } from "../ai/safety";
import { GLOSSARY } from "../ai/glossary";
import { getDocument } from "./documents";

export async function explainDocumentTerms(userId: string, documentId: string) {
  const doc = await getDocument(userId, documentId);
  const text = doc.extractedText ?? "";
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { locale: true } });
  // Only glossary terms that literally appear in the document are explained.
  const terms = [...new Set(GLOSSARY.map((g) => text.match(g.match)?.[0]).filter((x): x is string => !!x))].slice(0, 12);
  if (!terms.length) return { explanations: [] as Explanation[] };
  const provider = await providerFor(userId, "AI_PROCESSING");
  const { output } = await runAI<Explanation[]>({
    userId,
    task: "EXPLAIN_TERM",
    provider,
    inputScope: { categories: ["glossary_terms"], documentId, termsOnly: true },
    sourceRefs: [`MedicalDocument:${documentId}`],
    exec: (p) => p.explainTerms(terms, user.locale),
    postprocess: (out) => {
      const flags: string[] = [];
      const cleaned = out.map((e) => {
        const g = guardText(e.explanation);
        flags.push(...g.flags);
        return { term: e.term, explanation: g.text };
      });
      return { output: cleaned.filter((e) => e.explanation), flags };
    },
  });
  return { explanations: output };
}
