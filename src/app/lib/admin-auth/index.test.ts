import assert from "node:assert/strict";
import test from "node:test";
import * as OTPAuth from "otpauth";
import { secretDigest, verifySecretDigest } from "./secrets";
import {
    hashAdminPassword,
    hashRecoveryCode,
    isAdminAuthConfigured,
    matchAdminCredential,
    matchesAdminPassword,
    normalizeRecoveryCode,
} from ".";

const previousSecret = process.env.AUTH_TOTP_SECRET;
const previousRecoveryHashes = process.env.AUTH_TOTP_RECOVERY_HASHES;
const previousDatabaseUrl = process.env.DATABASE_URL;
const previousAuthSecret = process.env.AUTH_SECRET;
const previousPasswordHash = process.env.AUTH_ADMIN_PASSWORD_HASH;
const rfcSecret = OTPAuth.Secret.fromUTF8("12345678901234567890");

type EnvironmentName =
    | "AUTH_TOTP_SECRET"
    | "AUTH_TOTP_RECOVERY_HASHES"
    | "DATABASE_URL"
    | "AUTH_SECRET"
    | "AUTH_ADMIN_PASSWORD_HASH";

function restoreEnv(name: EnvironmentName, value: string | undefined) {
    if (value === undefined) delete process.env[name];
    else process.env[name] = value;
}

function configureTotp(secret = rfcSecret.base32) {
    process.env.AUTH_TOTP_SECRET = secret;
    process.env.AUTH_TOTP_RECOVERY_HASHES = "";
}

test.after(() => {
    restoreEnv("AUTH_TOTP_SECRET", previousSecret);
    restoreEnv("AUTH_TOTP_RECOVERY_HASHES", previousRecoveryHashes);
    restoreEnv("DATABASE_URL", previousDatabaseUrl);
    restoreEnv("AUTH_SECRET", previousAuthSecret);
    restoreEnv("AUTH_ADMIN_PASSWORD_HASH", previousPasswordHash);
});

test("accepts the RFC 6238 SHA1 token with the configured six digits", async () => {
    configureTotp();
    assert.deepEqual(await matchAdminCredential("287082", 59_000), {
        kind: "totp",
        counter: 1,
        recoveryHash: null,
    });
    assert.equal(await matchAdminCredential("287083", 59_000), null);
});

test("accepts the previous, current, and future TOTP intervals", async () => {
    configureTotp();
    const timestamp = 1_800_000;
    const cases = [
        { offset: -1, counter: 59 },
        { offset: 0, counter: 60 },
        { offset: 1, counter: 61 },
    ];

    for (const { offset, counter } of cases) {
        const token = OTPAuth.TOTP.generate({
            secret: rfcSecret,
            algorithm: "SHA1",
            digits: 6,
            period: 30,
            timestamp: timestamp + offset * 30_000,
        });
        assert.deepEqual(await matchAdminCredential(token, timestamp), {
            kind: "totp",
            counter,
            recoveryHash: null,
        });
    }
});

test("rejects TOTP codes outside the adjacent interval window", async () => {
    configureTotp();
    const timestamp = 1_800_000;

    for (const offset of [-2, 2]) {
        const token = OTPAuth.TOTP.generate({
            secret: rfcSecret,
            algorithm: "SHA1",
            digits: 6,
            period: 30,
            timestamp: timestamp + offset * 30_000,
        });
        assert.equal(await matchAdminCredential(token, timestamp), null);
    }
});

test("rejects malformed credential values", async () => {
    configureTotp();
    for (const value of [undefined, null, 123456, {}, "", "12345", "1234567", "12345a", "x".repeat(81)]) {
        assert.equal(await matchAdminCredential(value, 1_800_000), null);
    }
});

test("rejects malformed and shorter-than-20-byte TOTP secrets without throwing", async () => {
    const token = "864257";
    process.env.DATABASE_URL = "postgres://unit-test.invalid/admin-auth";
    process.env.AUTH_SECRET = "unit-test-auth-secret";
    const invalidSecrets = [
        "NOT-A-BASE32-SECRET",
        OTPAuth.Secret.fromUTF8("1234567890123456789").base32,
    ];

    for (const secret of invalidSecrets) {
        configureTotp(secret);
        assert.equal(await matchAdminCredential(token, 1_800_000), null);
        assert.equal(isAdminAuthConfigured(), false);
    }
});

test("normalizes and matches a configured recovery code hash", async () => {
    process.env.AUTH_TOTP_SECRET = new OTPAuth.Secret({ size: 20 }).base32;
    const recoveryCode = "ABCD-EFGH-JKLM-NPQR";
    const hash = hashRecoveryCode(recoveryCode);
    process.env.AUTH_TOTP_RECOVERY_HASHES = hash;
    assert.equal(normalizeRecoveryCode("abcd efgh-jklm npqr"), "ABCDEFGHJKLMNPQR");
    assert.deepEqual(await matchAdminCredential("abcd efgh-jklm npqr"), {
        kind: "recovery",
        counter: null,
        recoveryHash: secretDigest("ABCDEFGHJKLMNPQR"),
    });
    assert.equal(await matchAdminCredential("ABCD-EFGH-JKLM-NPQS"), null);
});

test("accepts only the configured admin password hash", async () => {
    process.env.AUTH_ADMIN_PASSWORD_HASH = hashAdminPassword("correct-password");
    assert.equal(await matchesAdminPassword("correct-password"), true);
    assert.equal(await matchesAdminPassword("  correct-password  "), true);
    assert.equal(await matchesAdminPassword("wrong-password"), false);
    assert.equal(await matchesAdminPassword(undefined), false);
});

test("uses independent salts and rejects malformed scrypt hashes", async () => {
    const first = hashAdminPassword("same-password");
    const second = hashAdminPassword("same-password");
    assert.notEqual(first, second);
    assert.equal(await verifySecretDigest(secretDigest("same-password"), first), true);
    assert.equal(await verifySecretDigest(secretDigest("same-password"), second), true);
    assert.equal(await verifySecretDigest(secretDigest("same-password"), "scrypt-sha256$bad$bad"), false);
});

test("preserves recovery replay identifiers when stored hashes are upgraded", async () => {
    configureTotp();
    const code = "ABCD-EFGH-JKLM-NPQR";
    process.env.AUTH_TOTP_RECOVERY_HASHES = secretDigest(normalizeRecoveryCode(code));
    const previous = await matchAdminCredential(code);
    process.env.AUTH_TOTP_RECOVERY_HASHES = hashRecoveryCode(code);
    assert.deepEqual(await matchAdminCredential(code), previous);
});

test("accepts the old password format during deployment migration", async () => {
    process.env.AUTH_ADMIN_PASSWORD_HASH = secretDigest("existing-password");
    assert.equal(await matchesAdminPassword("existing-password"), true);
    assert.equal(await matchesAdminPassword("incorrect-password"), false);
});
