import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Surface from ".";

const meta = {
    title: "DDS/Surface",
    component: Surface,
    args: { className: "max-w-sm p-dds-xl", children: "A place for related information." },
} satisfies Meta<typeof Surface>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
