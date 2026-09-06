import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import LottieGraphic from ".";
import ProjectVisual from "@/app/portfolio/_components/ProjectVisual";
import { projectAnimationSrc } from "@/app/portfolio/_data/project-scenes";

const meta = {
    title: "DDS/LottieGraphic",
    component: LottieGraphic,
    args: {
        src: projectAnimationSrc("speech"),
        children: <ProjectVisual kind="speech" />,
    },
    decorators: [(Story) => <div className="dds-motion-example"><Story /></div>],
} satisfies Meta<typeof LottieGraphic>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Speech: Story = {};
export const Conversations: Story = {
    args: { src: projectAnimationSrc("calls"), children: <ProjectVisual kind="calls" /> },
};
export const VisualComparison: Story = {
    args: { src: projectAnimationSrc("vision"), children: <ProjectVisual kind="vision" /> },
};
export const DocumentGraph: Story = {
    args: { src: projectAnimationSrc("graph"), children: <ProjectVisual kind="graph" /> },
};
export const UnavailableAnimation: Story = { args: { src: "/animations/unavailable.json" } };
