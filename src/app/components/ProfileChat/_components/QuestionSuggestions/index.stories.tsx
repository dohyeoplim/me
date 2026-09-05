import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { suggestedQuestions } from "../../_data/questions";
import "@/app/styles/dds-chat.css";
import QuestionSuggestions from ".";

const meta = {
    title: "Profile/Question cards",
    component: QuestionSuggestions,
    parameters: { layout: "padded" },
    args: { questions: suggestedQuestions.slice(0, 8), onSelect: () => undefined },
    argTypes: { onSelect: { action: "questionSelected" } },
} satisfies Meta<typeof QuestionSuggestions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InitialQuestions: Story = {};
export const AllQuestions: Story = { args: { questions: suggestedQuestions } };
export const FollowUps: Story = {
    args: {
        label: "Follow-up questions",
        questions: [
            { label: "More about Collog", question: "Tell me more about Collog.", sourceIds: ["collog"] },
            { label: "How do the projects differ?", question: "Compare Collog and MochiCall.", sourceIds: ["collog"] },
            {
                label: "Explore the speech repositories",
                question: "Show me related speech project repositories.",
                sourceIds: ["collog", "mochicall"],
            },
            {
                label: "What did you learn from ASR evaluation?",
                question: "What did you learn from ASR evaluation on MochiCall?",
                sourceIds: ["mochicall"],
            },
        ],
    },
};
export const Pending: Story = { args: { disabled: true } };
export const Empty: Story = { args: { questions: [] } };
