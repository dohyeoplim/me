import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import FoundationsShowcase from ".";

const meta = {
    title: "DDS/Examples/Foundations",
    component: FoundationsShowcase,
    parameters: { layout: "padded" },
} satisfies Meta<typeof FoundationsShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
