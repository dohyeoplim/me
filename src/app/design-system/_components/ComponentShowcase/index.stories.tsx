import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ComponentShowcase from ".";

const meta = {
    title: "DDS/Examples/Components",
    component: ComponentShowcase,
    parameters: { layout: "padded" },
} satisfies Meta<typeof ComponentShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
