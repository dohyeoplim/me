import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Disclosure from ".";

const meta = {
    title: "DDS/Disclosure",
    component: Disclosure,
    args: { label: "Project details", children: "Additional methods, experiments, and results." },
} satisfies Meta<typeof Disclosure>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Outlined: Story = {};
export const Plain: Story = { args: { variant: "plain" } };
export const Open: Story = { args: { open: true } };
export const SubtleContent: Story = { args: { contentTone: "subtle", open: true } };
export const LongLabel: Story = {
    args: { label: "Methods, evaluation settings, and error analysis from the recognition experiments" },
};
