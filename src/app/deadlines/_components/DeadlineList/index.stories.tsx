import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { Conference } from "@/app/lib/deadlines/schema";
import { buildDeadlineBoard } from "@/app/lib/deadlines/timeline";
import DeadlineList from ".";
import "../../deadlines.css";

const now = Date.parse("2026-11-10T00:00:00Z");

const conference = (id: string, overrides: Partial<Conference>): Conference => ({
    id, name: "Example Conference", year: 2027, area: "ml", url: "https://example.com", location: "",
    dates: "", deadlines: [], status: "published", ...overrides,
});

const conferences = [
    conference("alpha-2027", {
        name: "Alpha", area: "ml", location: "Seoul", dates: "July 12-18, 2027",
        deadlines: [
            { label: "Abstract", kind: "submission", at: "2026-11-05T23:59:00-12:00" },
            { label: "Paper", kind: "submission", at: "2026-11-24T23:59:00-12:00" },
            { label: "Notification", kind: "review", at: "2027-02-01T23:59:00-12:00" },
        ],
    }),
    conference("beta-2027", {
        name: "Beta", area: "speech",
        deadlines: [{ label: "Paper", kind: "submission", at: "2026-11-10T16:00:00+00:00" }],
    }),
    conference("gamma-2027", { name: "Gamma", area: "cv" }),
    conference("delta-2026", {
        name: "Delta", year: 2026, area: "nlp",
        deadlines: [{ label: "Paper", kind: "submission", at: "2026-06-01T23:59:00-12:00" }],
    }),
];

const meta = {
    title: "Deadlines/Conference list",
    component: DeadlineList,
    args: { board: buildDeadlineBoard(conferences, now), now },
} satisfies Meta<typeof DeadlineList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Empty: Story = { args: { board: buildDeadlineBoard([], now) } };
