import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import DetailDialog from ".";

const meta = {
    title: "DDS/Detail dialog",
    component: DetailDialog,
    args: { title: "Project details", label: "Project details", children: <p>Research and implementation notes.</p> },
} satisfies Meta<typeof DetailDialog>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const ExpandingCard: Story = {
    args: { expandFromCard: true, triggerStyle: "card" },
    decorators: [(Story) => (
        <article className="ds-panel p-dds-xl relative" data-dialog-origin>
            <h2 className="font-work-title">Selected project</h2>
            <Story />
        </article>
    )],
};
export const LongContent: Story = {
    args: { children: Array.from({ length: 20 }, (_, index) => <p key={index}>Research and implementation notes.</p>) },
};
