import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Surface from ".";

const meta = {
    title: "DDS/Surface",
    component: Surface,
    args: { padding: "comfortable", className: "font-body", children: "Project details and supporting information." },
    argTypes: {
        variant: { control: "select", options: ["plain", "subtle", "outlined"] },
        padding: { control: "select", options: ["none", "compact", "comfortable"] },
    },
} satisfies Meta<typeof Surface>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Plain: Story = { args: { variant: "plain" } };
export const Subtle: Story = { args: { variant: "subtle" } };
export const Compact: Story = { args: { padding: "compact" } };
export const WithoutPadding: Story = { args: { padding: "none" } };
export const LongContent: Story = {
    args: {
        children: "Evaluation data includes industrial identifiers photographed in different lighting conditions.",
    },
    decorators: [(Story) => <div className="dds-narrow-example"><Story /></div>],
};
