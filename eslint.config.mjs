import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { ddsTokens } from "./eslint-rules/dds-tokens.mjs";

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    {
        files: [
            "src/app/portfolio/**/*.{ts,tsx}",
            "src/app/design-system/**/*.{ts,tsx}",
            "src/app/components/DDS/**/*.{ts,tsx}",
            "src/app/components/{Header,Footer,LinkButton}/**/*.{ts,tsx}",
        ],
        plugins: { dds: { rules: { tokens: ddsTokens } } },
        rules: { "dds/tokens": "error" },
    },
    globalIgnores([".next/**", "out/**", "build/**", "storybook-static/**", "next-env.d.ts"]),
]);

export default eslintConfig;
