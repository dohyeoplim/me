import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Metric from ".";

const meta = {
    title: "DDS/Metric",
    component: Metric,
    args: { value: "8,000", label: "images annotated", detail: "Industrial OCR evaluation data" },
    argTypes: { variant: { control: "select", options: ["inline", "stacked"] } },
} satisfies Meta<typeof Metric>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Stacked: Story = { args: { variant: "stacked" } };
export const WithoutDetail: Story = { args: { detail: undefined } };
export const LongResult: Story = {
    args: {
        value: "12.3 to 31.2 percentage points",
        label: "improvement in exact-match accuracy",
        detail: "Across four structured identifier benchmarks.",
    },
    decorators: [(Story) => <div className="dds-narrow-example"><Story /></div>],
};
