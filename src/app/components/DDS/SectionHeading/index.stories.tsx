import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import SectionHeading from ".";

const meta = {
    title: "DDS/SectionHeading",
    component: SectionHeading,
    args: { title: "Research", description: "Document understanding and recognition." },
    argTypes: {
        variant: { control: "select", options: ["section", "subsection"] },
        as: { control: "select", options: ["h2", "h3", "h4"] },
    },
} satisfies Meta<typeof SectionHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Subsection: Story = { args: { title: "Industrial OCR", variant: "subsection" } };
export const WithoutDescription: Story = { args: { description: undefined } };
export const LongTitle: Story = {
    args: { title: "Synthetic data for industrial document understanding", variant: "subsection" },
    decorators: [(Story) => <div className="dds-narrow-example"><Story /></div>],
};
