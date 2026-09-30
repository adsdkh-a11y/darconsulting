import { promises as fs } from "node:fs";
import path from "node:path";
import { decrypt, encrypt } from "../crypto";

/**
 * Object storage abstraction. Production target: S3-compatible bucket in an EU
 * region (server-side encryption + our own envelope encryption). The MVP ships
 * a local encrypted-filesystem driver with the same interface.
 */
export interface StorageProvider {
  put(key: string, data: Buffer): Promise<void>;
  get(key: string): Promise<Buffer>;
  delete(key: string): Promise<void>;
}

class LocalEncryptedStorage implements StorageProvider {
  constructor(private root: string) {}
  private file(key: string) {
    if (!/^[a-zA-Z0-9/_-]+$/.test(key)) throw new Error("Invalid storage key");
    return path.join(this.root, key);
  }
  async put(key: string, data: Buffer) {
    const f = this.file(key);
    await fs.mkdir(path.dirname(f), { recursive: true });
    await fs.writeFile(f, encrypt(data));
  }
  async get(key: string) {
    return decrypt(await fs.readFile(this.file(key)));
  }
  async delete(key: string) {
    await fs.rm(this.file(key), { force: true });
  }
}

let instance: StorageProvider | null = null;
export function storage(): StorageProvider {
  if (!instance) instance = new LocalEncryptedStorage(path.resolve(process.env.STORAGE_DIR ?? "./.data/storage"));
  return instance;
}
