import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import LottieGraphic from "@/app/components/DDS/LottieGraphic";
import ProjectVisual from ".";
import { projectAnimationSrc } from "../../_data/project-scenes";

const meta = {
    title: "Portfolio/Project illustrations",
    component: ProjectVisual,
    args: { kind: "speech" },
    render: ({ kind }) => (
        <div className="dds-illustration-preview">
            <LottieGraphic src={projectAnimationSrc(kind)}><ProjectVisual kind={kind} /></LottieGraphic>
        </div>
    ),
} satisfies Meta<typeof ProjectVisual>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MochiCall: Story = {};
export const Collog: Story = { args: { kind: "calls" } };
export const Wonnit: Story = { args: { kind: "vision" } };
export const DocFusionX: Story = { args: { kind: "graph" } };
export const Static: Story = {
    render: ({ kind }) => <div className="dds-illustration-preview"><ProjectVisual kind={kind} /></div>,
};
