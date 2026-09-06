import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import GraphicsShowcase from ".";

const meta = {
    title: "DDS/Graphics guide",
    component: GraphicsShowcase,
    decorators: [(Story) => <div className="dds-container"><Story /></div>],
} satisfies Meta<typeof GraphicsShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
