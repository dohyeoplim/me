import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import "@/app/styles/dds-chat.css";
import AnswerLoading from ".";

const meta = {
    title: "Profile/Answer loading",
    component: AnswerLoading,
    parameters: { layout: "padded" },
    decorators: [(Story) => (
        <div className="dds-chat-response">
            <Story />
        </div>
    )],
} satisfies Meta<typeof AnswerLoading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
