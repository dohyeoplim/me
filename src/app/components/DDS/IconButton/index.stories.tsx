import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bell } from "lucide-react";
import IconButton from ".";

const meta = {
    title: "DDS/IconButton",
    component: IconButton,
    args: { "aria-label": "Notifications", children: <Bell size={18} aria-hidden="true" /> },
    argTypes: {
        variant: { control: "select", options: ["solid", "outline", "text"] },
        size: { control: "select", options: ["small", "medium", "large"] },
    },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Solid: Story = {};
export const Outline: Story = { args: { variant: "outline" } };
export const Text: Story = { args: { variant: "text" } };
export const Small: Story = { args: { size: "small" } };
export const Large: Story = { args: { size: "large" } };
export const Disabled: Story = { args: { disabled: true } };
export const Selected: Story = { args: { variant: "outline", "aria-pressed": true } };
export const Focus: Story = {
    render: (args) => <IconButton {...args} data-preview-state="focus" />,
};
