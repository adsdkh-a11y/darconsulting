import { withUser } from "@/server/http";
import { badRequest } from "@/server/errors";
import { uploadDocument } from "@/server/services/documents";
import { MAX_UPLOAD_BYTES } from "@/server/services/fileValidation";

export const POST = withUser(async ({ req, userId }) => {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) throw badRequest("Please choose a file");
  if (file.size > MAX_UPLOAD_BYTES) throw badRequest("The file is larger than 15 MB");
  const doc = await uploadDocument(userId, {
    fileName: file.name,
    title: typeof form.get("title") === "string" ? (form.get("title") as string) : undefined,
    data: Buffer.from(await file.arrayBuffer()),
  });
  return { id: doc.id, status: doc.status };
});
