export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public code = "error",
  ) {
    super(message);
  }
}

export const notFound = (what = "Not found") => new HttpError(404, what, "not_found");
export const badRequest = (msg: string) => new HttpError(400, msg, "bad_request");
export const unauthorized = () => new HttpError(401, "Authentication required", "unauthorized");
export const forbidden = (msg = "Forbidden") => new HttpError(403, msg, "forbidden");
