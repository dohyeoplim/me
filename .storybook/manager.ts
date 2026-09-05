import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";
import { DDS } from "../src/app/components/DDS/config";

addons.setConfig({
    theme: create({
        base: "light",
        brandTitle: `${DDS.name} · ${DDS.fullName}`,
        colorPrimary: "#0f0f10",
        colorSecondary: "#1c1c1e",
        appBg: "#fafafc",
        appContentBg: "#fafafc",
        textColor: "#0f0f10",
        fontBase: '"Pretendard", system-ui, sans-serif',
    }),
});
