import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import MotionShowcase from ".";

const meta = {
    title: "DDS/Examples/Motion",
    component: MotionShowcase,
    parameters: { layout: "padded" },
} satisfies Meta<typeof MotionShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
