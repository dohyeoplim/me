import { mkdir, writeFile } from "node:fs/promises";

const base = "https://raw.githubusercontent.com/orioncactus/pretendard/v1.3.9/";
const source = `${base}packages/pretendard/dist/web/variable/woff2-dynamic-subset/`;
const destination = new URL("../src/assets/fonts/pretendard/woff2-dynamic-subset/", import.meta.url);
await mkdir(destination, { recursive: true });

for (let index = 0; index < 92; index += 6) {
    await Promise.all(Array.from({ length: Math.min(6, 92 - index) }, async (_, offset) => {
        const name = `PretendardVariable.subset.${index + offset}.woff2`;
        const response = await fetch(`${source}${name}`);
        if (!response.ok) throw new Error(`Font download failed for ${name}`);
        const data = Buffer.from(await response.arrayBuffer());
        if (data.subarray(0, 4).toString() !== "wOF2") throw new Error(`Invalid font ${name}`);
        await writeFile(new URL(name, destination), data);
    }));
}

console.log("Downloaded 92 Pretendard 1.3.9 variable font subsets.");
