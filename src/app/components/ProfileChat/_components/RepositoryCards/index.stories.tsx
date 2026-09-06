import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ProfileRepository } from "@/app/lib/profile-chat/types";
import "@/app/styles/dds-answer-blocks.css";
import RepositoryCards from ".";

const organization: ProfileRepository = {
    sourceId: "github-fresh-mango-mochi-welfare-call-asr",
    fullName: "Fresh-Mango-Mochi/welfare-call-asr",
    url: "https://github.com/Fresh-Mango-Mochi/welfare-call-asr",
    description: "Korean speech recognition for transportation support calls.",
    owner: "Fresh-Mango-Mochi",
    ownerType: "Organization",
    language: "Python",
    reason: "Explore the domain-specific speech recognition work used in MochiCall.",
};

const personal: ProfileRepository = {
    sourceId: "github-dohyeoplim-me",
    fullName: "dohyeoplim/me",
    url: "https://github.com/dohyeoplim/me",
    description: "Personal website and portfolio.",
    owner: "dohyeoplim",
    ownerType: "User",
    language: "TypeScript",
    reason: "The repository for this profile and portfolio.",
};

const meta = {
    title: "Profile/Repository cards",
    component: RepositoryCards,
    parameters: { layout: "padded" },
    args: { repositories: [organization] },
} satisfies Meta<typeof RepositoryCards>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Organization: Story = {};
export const Personal: Story = { args: { repositories: [personal] } };
export const MixedOwners: Story = { args: { repositories: [organization, personal] } };
export const MissingDescription: Story = {
    args: { repositories: [{ ...organization, description: "", language: null }] },
};
export const Empty: Story = { args: { repositories: [] } };
