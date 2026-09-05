import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import LottieGraphic from ".";

const meta = {
    title: "DDS/LottieGraphic",
    component: LottieGraphic,
    args: {
        src: "/animations/speech.json",
        children: <p className="font-body02-light">Speech becomes a trip record.</p>,
    },
    decorators: [(Story) => <div className="dds-motion-example"><Story /></div>],
} satisfies Meta<typeof LottieGraphic>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Speech: Story = {};
export const Conversations: Story = { args: { src: "/animations/calls.json" } };
export const VisualComparison: Story = { args: { src: "/animations/vision.json" } };
export const DocumentGraph: Story = { args: { src: "/animations/graph.json" } };
