/**
 * Upload validation (step 2 of the document pipeline).
 * - allow-list by magic bytes, not by extension or client MIME type
 * - size limit
 * - reject PDFs with active content (JavaScript, launch actions, embedded files)
 * A production deployment adds an antivirus scan (e.g. ClamAV) behind the
 * `scanForMalware` hook.
 */
export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;

export type ValidatedFile = { mimeType: "application/pdf" | "image/png" | "image/jpeg"; ext: string };

export function sniffType(buf: Buffer): ValidatedFile | null {
  if (buf.subarray(0, 5).toString("latin1") === "%PDF-") return { mimeType: "application/pdf", ext: "pdf" };
  if (buf.length > 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { mimeType: "image/png", ext: "png" };
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return { mimeType: "image/jpeg", ext: "jpg" };
  return null;
}

export function validateUpload(buf: Buffer): { ok: true; file: ValidatedFile } | { ok: false; reason: string } {
  if (buf.length === 0) return { ok: false, reason: "The file is empty" };
  if (buf.length > MAX_UPLOAD_BYTES) return { ok: false, reason: "The file is larger than 15 MB" };
  const file = sniffType(buf);
  if (!file) return { ok: false, reason: "Only PDF, JPEG and PNG files are supported" };
  if (file.mimeType === "application/pdf") {
    const raw = buf.toString("latin1");
    if (/\/(JavaScript|JS|Launch|EmbeddedFile|RichMedia|XFA)\b/.test(raw)) {
      return { ok: false, reason: "This PDF contains active content and was rejected for your safety" };
    }
  }
  const scan = scanForMalware(buf);
  if (!scan.clean) return { ok: false, reason: "The file did not pass the security scan" };
  return { ok: true, file };
}

/** Hook for an antivirus engine. The MVP relies on the structural checks above. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function scanForMalware(_buf: Buffer): { clean: boolean } {
  return { clean: true };
}
