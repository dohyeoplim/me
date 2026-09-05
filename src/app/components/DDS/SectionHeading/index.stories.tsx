import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import SectionHeading from ".";

const meta = {
    title: "DDS/SectionHeading",
    component: SectionHeading,
    args: { title: "Research", description: "From collecting the data to understanding the errors." },
} satisfies Meta<typeof SectionHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithoutDescription: Story = { args: { description: undefined } };
