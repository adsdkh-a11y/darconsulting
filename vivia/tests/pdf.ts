import PDFDocument from "pdfkit";

/** Build a real PDF with a text layer, like a lab portal download. */
export function encryptTextPdf(text: string): Promise<Buffer> {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const chunks: Buffer[] = [];
    doc.on("data", (c: Buffer) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    for (const line of text.split("\n")) doc.text(line);
    doc.end();
  });
}
