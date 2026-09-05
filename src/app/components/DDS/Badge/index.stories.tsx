import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Badge from ".";

const meta = {
    title: "DDS/Badge",
    component: Badge,
    args: { children: "Research" },
    argTypes: { tone: { control: "select", options: ["neutral", "accent", "success"] } },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {};
export const Accent: Story = { args: { tone: "accent", children: "Under review" } };
export const Success: Story = { args: { tone: "success", children: "Complete" } };
