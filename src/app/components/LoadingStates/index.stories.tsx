import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import WritingSkeleton from "@/app/blog/_components/WritingSkeleton";
import AdminSkeleton from "@/app/admin/_components/AdminSkeleton";
import SignInLoading from "@/app/admin/signin/loading";
import "@/app/blog/writing.css";

const meta = {
    title: "Pages/Loading states",
    component: WritingSkeleton,
    parameters: { layout: "fullscreen" },
} satisfies Meta<typeof WritingSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Writing: Story = {};
export const Article: Story = { args: { article: true } };
export const Knowledge: Story = {
    render: () => <div className="dds-container writing-page"><AdminSkeleton variant="knowledge" /></div>,
};
export const Dashboard: Story = {
    render: () => <div className="dds-container writing-page"><AdminSkeleton variant="dashboard" /></div>,
};
export const Editor: Story = {
    render: () => <div className="dds-container writing-page"><AdminSkeleton variant="editor" /></div>,
};
export const Intro: Story = {
    render: () => <div className="dds-container writing-page"><AdminSkeleton variant="intro" /></div>,
};
export const SignIn: Story = {
    render: () => <div className="dds-container writing-page"><SignInLoading /></div>,
};
