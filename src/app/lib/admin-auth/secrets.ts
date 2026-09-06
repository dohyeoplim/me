import { createHash, randomBytes, scrypt, scryptSync, timingSafeEqual } from "node:crypto";

const cost = { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
const digestPattern = /^[a-f0-9]{64}$/;
const storedPattern = /^scrypt-sha256\.([a-f0-9]{32})\.([a-f0-9]{64})$/;

export function secretDigest(value: string) {
    return createHash("sha256").update(value).digest("hex");
}

export function isStoredSecret(value: string) {
    return digestPattern.test(value) || storedPattern.test(value.replaceAll("$", "."));
}

export function hashSecret(value: string) {
    const salt = randomBytes(16).toString("hex");
    const key = scryptSync(secretDigest(value), salt, 32, cost).toString("hex");
    return `scrypt-sha256.${salt}.${key}`;
}

export async function verifySecretDigest(digest: string, stored: string) {
    if (!digestPattern.test(digest)) return false;
    if (digestPattern.test(stored)) return timingSafeEqual(Buffer.from(digest), Buffer.from(stored));
    const match = storedPattern.exec(stored.replaceAll("$", "."));
    const salt = match?.[1];
    const expected = match?.[2];
    if (!salt || !expected) return false;
    const key = await new Promise<Buffer>((resolve, reject) => {
        scrypt(digest, salt, 32, cost, (error, value) => error ? reject(error) : resolve(value));
    });
    return timingSafeEqual(key, Buffer.from(expected, "hex"));
}
