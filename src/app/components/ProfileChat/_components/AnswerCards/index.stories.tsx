import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { profileCardRegistry } from "@/app/lib/profile-chat/types";
import "@/app/portfolio/portfolio.css";
import "@/app/styles/dds-answer-cards.css";
import ProfileChatCards from ".";

const meta = {
    title: "Portfolio/Answer cards",
    component: ProfileChatCards,
    parameters: { layout: "padded" },
    args: { cards: [profileCardRegistry.profile] },
} satisfies Meta<typeof ProfileChatCards>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Profile: Story = {};
export const Research: Story = { args: { cards: [profileCardRegistry.eact] } };
export const Projects: Story = {
    args: {
        cards: [
            profileCardRegistry.mochicall,
            profileCardRegistry.collog,
            profileCardRegistry.wonnit,
            profileCardRegistry.docfusionx,
        ],
    },
};
export const Education: Story = { args: { cards: [profileCardRegistry.education] } };
export const Experience: Story = {
    args: { cards: [profileCardRegistry.infrastructure, profileCardRegistry.community, profileCardRegistry.skills] },
};
export const UnknownCard: Story = { args: { cards: [{ type: "project", id: "not-registered" }] } };
