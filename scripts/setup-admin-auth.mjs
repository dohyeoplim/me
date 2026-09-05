import { createHash, randomBytes } from "node:crypto";
import { chmodSync, existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import * as OTPAuth from "otpauth";

const envPath = resolve(".env.local");
const rotate = process.argv.includes("--rotate");
const source = existsSync(envPath) ? readFileSync(envPath, "utf8") : "";

function envValue(name) {
    const match = source.match(new RegExp(`^${name}=(.*)$`, "m"));
    return match?.[1].trim().replace(/^['"]|['"]$/g, "") ?? "";
}

function setEnv(input, name, value) {
    const line = `${name}=${value}`;
    const pattern = new RegExp(`^${name}=.*$`, "m");
    if (pattern.test(input)) return input.replace(pattern, line);
    return `${input.trimEnd()}${input.trim() ? "\n" : ""}${line}\n`;
}

if (envValue("AUTH_TOTP_SECRET") && !rotate) {
    console.error("Admin TOTP is already configured. Use --rotate to replace it and its recovery codes.");
    process.exit(1);
}

const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const recoveryCodes = Array.from({ length: 8 }, () => {
    const bytes = randomBytes(16);
    const raw = Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
    return raw.match(/.{4}/g).join("-");
});
const hashes = recoveryCodes.map((code) => createHash("sha256").update(code.replace(/-/g, "")).digest("hex"));
const secret = new OTPAuth.Secret({ size: 20 }).base32;
const authSecret = randomBytes(32).toString("base64url");
const accessKey = randomBytes(24).toString("base64url");
let next = setEnv(source, "AUTH_SECRET", authSecret);
next = setEnv(next, "AUTH_TOTP_SECRET", secret);
next = setEnv(next, "AUTH_TOTP_RECOVERY_HASHES", hashes.join(","));
next = setEnv(next, "AUTH_ADMIN_ACCESS_HASH", createHash("sha256").update(accessKey).digest("hex"));

const temporaryPath = `${envPath}.${process.pid}.tmp`;
writeFileSync(temporaryPath, next, { mode: 0o600 });
renameSync(temporaryPath, envPath);
chmodSync(envPath, 0o600);

console.log("Admin TOTP is saved in .env.local. Restart the development server after adding it to Enpass.");
console.log("\nEnpass one-time code\n");
console.log("Issuer: Dohyeop Lim");
console.log("Account: Admin");
console.log(`Password: ${accessKey}`);
console.log(`Secret: ${secret}`);
console.log("Type: TOTP, Algorithm: SHA1, Digits: 6, Period: 30 seconds");
console.log("\nRecovery codes, save these in Enpass\n");
for (const code of recoveryCodes) console.log(code);
console.log("\nEach recovery code works once. Running this command again requires --rotate.");
