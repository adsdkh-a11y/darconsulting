import { extractText, getDocumentProxy } from "unpdf";

/** Text layer of a PDF (step 3). Scanned PDFs return "" and need OCR. */
export async function pdfToText(buf: Buffer): Promise<string> {
  try {
    const pdf = await getDocumentProxy(new Uint8Array(buf));
    const { text } = await extractText(pdf, { mergePages: true });
    return text ?? "";
  } catch (e) {
    console.warn("[documents] PDF text extraction failed:", (e as Error).message);
    return "";
  }
}
