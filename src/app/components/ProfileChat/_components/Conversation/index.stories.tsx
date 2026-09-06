import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import type { ProfileExchange } from "../../Context";
import "@/app/styles/dds-chat.css";
import Conversation from ".";

const textOnlyExchange: ProfileExchange = {
    id: "text-only-answer",
    question: "What are you researching now?",
    answer: "I study reliable multimodal systems, with recent work on document understanding and speech.",
    cards: [],
    blocks: [],
    followUps: [],
    repositories: [],
    sources: [{ id: "profile", title: "Profile", url: "/portfolio" }],
};

const meta = {
    title: "Profile/Conversation",
    component: Conversation,
    parameters: { layout: "padded" },
    args: {
        exchanges: [textOnlyExchange],
        pendingQuestion: "",
        pending: false,
        error: "",
        onRetry: fn(),
    },
} satisfies Meta<typeof Conversation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextOnlyAnswer: Story = {};
export const WaitingForAnswer: Story = {
    args: {
        exchanges: [],
        pendingQuestion: "Which projects use speech recognition?",
        pending: true,
    },
};
export const FailedAnswer: Story = {
    args: {
        exchanges: [],
        pendingQuestion: "Which projects use speech recognition?",
        pending: false,
        error: "The answer could not be loaded. Please try again.",
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByRole("alert")).toHaveTextContent(args.error ?? "");
        await userEvent.click(canvas.getByRole("button", { name: "Try again" }));
        await expect(args.onRetry).toHaveBeenCalledOnce();
    },
};
