import { chmodSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { readEnvValue, setEnvValue, upgradeSecretDigest } from "./lib/admin-secrets.mjs";

const envPath = resolve(process.argv[2] ?? ".env.local");
const source = readFileSync(envPath, "utf8");
let updated = source;

for (const name of ["AUTH_ADMIN_PASSWORD_HASH", "AUTH_TOTP_RECOVERY_HASHES"]) {
    const current = readEnvValue(source, name);
    if (!current) continue;
    const value = current.split(",").map((digest) => upgradeSecretDigest(digest.trim())).join(",");
    updated = setEnvValue(updated, name, value);
}

if (updated === source) {
    console.log("Stored credentials already use scrypt.");
} else {
    const temporaryPath = `${envPath}.${process.pid}.tmp`;
    writeFileSync(temporaryPath, updated, { mode: 0o600, flag: "wx" });
    renameSync(temporaryPath, envPath);
    chmodSync(envPath, 0o600);
    console.log("Stored credentials now use scrypt. Your password, OTP setup, and recovery codes stay the same.");
    console.log("Update AUTH_ADMIN_PASSWORD_HASH and AUTH_TOTP_RECOVERY_HASHES in the deployment environment.");
}
