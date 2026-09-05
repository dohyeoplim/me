import type { Preview } from "@storybook/nextjs-vite";
import "../src/app/globals.css";
import "../src/app/styles/dds-components.css";
import "./preview.css";

const preview: Preview = {
    parameters: {
        layout: "centered",
        nextjs: { appDirectory: true },
        controls: { expanded: true },
        a11y: { test: "error" },
        options: {
            storySort: {
                order: ["DDS", ["Button", "IconButton", "TextField", "Badge", "Surface", "Metric", "SectionHeading"]],
            },
        },
    },
    tags: ["autodocs"],
};

export default preview;
