import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Metric from ".";

const meta = {
    title: "DDS/Metric",
    component: Metric,
    args: { value: "~8,000", label: "Images annotated", detail: "Industrial OCR evaluation data" },
} satisfies Meta<typeof Metric>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithoutDetail: Story = { args: { value: "1st", label: "In the department", detail: undefined } };
