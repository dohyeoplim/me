import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";

const root = fileURLToPath(new URL("..", import.meta.url));
const require = createRequire(import.meta.url);
const output = mkdtempSync(join(tmpdir(), "profile-chat-tests-"));

try {
    const compile = spawnSync(process.execPath, [
        require.resolve("typescript/lib/tsc.js"), "src/app/lib/profile-chat/profile-chat.test.ts",
        "--outDir", output, "--module", "commonjs", "--target", "es2022",
        "--esModuleInterop", "--skipLibCheck", "--types", "node",
    ], { cwd: root, stdio: "inherit" });

    if (compile.status !== 0) {
        process.exitCode = compile.status ?? 1;
    } else {
        const result = spawnSync(process.execPath, ["--test", join(output, "lib/profile-chat/profile-chat.test.js")], {
            cwd: root,
            stdio: "inherit",
            env: { ...process.env, NODE_PATH: join(root, "node_modules") },
        });
        process.exitCode = result.status ?? 1;
    }
} finally {
    rmSync(output, { recursive: true, force: true });
}
