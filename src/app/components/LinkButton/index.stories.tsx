import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import LinkButton from ".";

const meta = {
    title: "DDS/LinkButton",
    component: LinkButton,
    args: { href: "/portfolio", label: "View portfolio" },
} satisfies Meta<typeof LinkButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Internal: Story = {};
export const External: Story = { args: { href: "https://github.com/dohyeoplim", label: "GitHub", icon: "external" } };
