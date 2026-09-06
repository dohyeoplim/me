import { createHash, randomBytes, scryptSync } from "node:crypto";

export function upgradeSecretDigest(digest) {
    const normalized = digest.replaceAll("$", ".");
    if (/^scrypt-sha256\.[a-f0-9]{32}\.[a-f0-9]{64}$/.test(normalized)) return normalized;
    if (!/^[a-f0-9]{64}$/.test(digest)) throw new Error("Invalid stored credential format.");
    const salt = randomBytes(16).toString("hex");
    const options = { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
    const key = scryptSync(digest, salt, 32, options).toString("hex");
    return `scrypt-sha256.${salt}.${key}`;
}

export function hashSecret(value) {
    return upgradeSecretDigest(createHash("sha256").update(value).digest("hex"));
}

export function readEnvValue(source, name) {
    const value = source.match(new RegExp(`^${name}=(.*)$`, "m"))?.[1]?.trim() ?? "";
    return value.replace(/^['"]|['"]$/g, "").replace(/\\\$/g, "$");
}

export function setEnvValue(source, name, value) {
    const line = `${name}=${value.replace(/\$/g, "\\$")}`;
    const pattern = new RegExp(`^${name}=.*$`, "m");
    if (pattern.test(source)) return source.replace(pattern, () => line);
    return `${source.trimEnd()}${source.trim() ? "\n" : ""}${line}\n`;
}
