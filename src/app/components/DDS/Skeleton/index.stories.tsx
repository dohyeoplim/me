import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Skeleton, { SkeletonGroup, SkeletonText } from ".";

const meta = {
    title: "DDS/Skeleton",
    component: Skeleton,
    parameters: { layout: "padded" },
    args: { variant: "text", width: "full" },
    render: (args) => <div className="dds-skeleton-preview"><Skeleton {...args} /></div>,
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {};
export const Title: Story = { args: { variant: "title", width: "medium" } };
export const Section: Story = { args: { variant: "section", width: "medium" } };
export const Control: Story = { args: { variant: "control" } };
export const Avatar: Story = { args: { variant: "avatar" } };
export const Media: Story = { args: { variant: "media" } };
export const Paragraph: Story = {
    render: () => (
        <SkeletonGroup label="Loading text" className="dds-skeleton-preview">
            <SkeletonText lines={4} lastLine="long" />
        </SkeletonGroup>
    ),
};
export const Content: Story = {
    render: () => (
        <SkeletonGroup label="Loading content" className="dds-skeleton-preview dds-skeleton-document">
            <Skeleton variant="media" />
            <Skeleton variant="heading" width="medium" />
            <SkeletonText lines={3} />
        </SkeletonGroup>
    ),
};
