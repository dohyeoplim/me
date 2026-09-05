import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ProfileAnswerBlock } from "@/app/lib/profile-chat/types";
import "@/app/styles/dds-chat.css";
import "@/app/styles/dds-answer-blocks.css";
import AnswerBlocks from ".";

const facts: ProfileAnswerBlock = {
    type: "facts",
    title: "My work on Collog",
    sourceIds: ["collog"],
    items: [
        { label: "Input", value: "Everyday family calls with older adults." },
        { label: "Contribution", value: "Speech transcription, health information extraction, and acoustic analysis." },
        { label: "Across calls", value: "Track changes and generate follow-up questions from earlier conversations." },
    ],
};

const steps: ProfileAnswerBlock = {
    type: "steps",
    title: "From a call to a follow-up question",
    sourceIds: ["collog"],
    items: [
        { title: "Transcribe the call", description: "Speech transcription provides the conversation text." },
        {
            title: "Extract health information",
            description: "The pipeline extracts health details and includes acoustic analysis.",
        },
        {
            title: "Prepare the next conversation",
            description: "Previous records help identify changes and suggest questions for a later call.",
        },
    ],
};

const comparison: ProfileAnswerBlock = {
    type: "comparison",
    title: "Two uses of speech recognition",
    sourceIds: ["mochicall", "collog"],
    columns: ["MochiCall", "Collog"],
    rows: [
        { label: "Input", values: ["Transportation support calls", "Family calls with older adults"] },
        { label: "Output", values: ["Trip records for dispatch", "Health and lifestyle records"] },
        { label: "My work", values: ["Domain-specific Korean ASR with LoRA", "Transcription and health extraction"] },
    ],
};

const timeline: ProfileAnswerBlock = {
    type: "timeline",
    title: "Recent speech projects",
    sourceIds: ["mochicall", "collog"],
    items: [
        { date: "July 2026", title: "MochiCall", description: "Korean ASR for transportation support calls." },
        {
            date: "July to August 2026",
            title: "Collog",
            description: "Health and lifestyle records from family calls.",
        },
    ],
};

const meta = {
    title: "Profile/Answer blocks",
    component: AnswerBlocks,
    parameters: { layout: "padded" },
    args: { blocks: [facts] },
} satisfies Meta<typeof AnswerBlocks>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Facts: Story = {};
export const ExpandableSteps: Story = { args: { blocks: [steps] } };
export const Comparison: Story = { args: { blocks: [comparison] } };
export const Timeline: Story = { args: { blocks: [timeline] } };
export const Combined: Story = { args: { blocks: [facts, steps] } };
export const Empty: Story = { args: { blocks: [] } };
export const LongValues: Story = {
    args: {
        blocks: [{
            ...facts,
            items: [{
                label: "Contribution across the speech pipeline",
                value: "Speech transcription, health information extraction, and acoustic analysis support " +
                    "records that can be compared across calls. Earlier conversation records also inform " +
                    "questions for the next family call.",
            }, facts.items[2]],
        }],
    },
};
