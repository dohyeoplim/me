import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import GalleryCard from ".";

const meta = {
    title: "DDS/Gallery card",
    component: GalleryCard,
    args: {
        title: "Image preview",
        description: "A short description of the selected item.",
        detailsLabel: "View details",
        mediaLabel: "Image placeholder",
        media: <div className="dds-gallery-placeholder" aria-hidden="true">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 0L100 100M100 0L0 100" vectorEffect="non-scaling-stroke" />
            </svg>
        </div>,
        children: <p>Details for the selected item.</p>,
    },
    decorators: [(Story) => <div className="dds-container"><Story /></div>],
} satisfies Meta<typeof GalleryCard>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const LongDescription: Story = {
    args: { description: "A longer description stays on one line in the card and is shown in full in the detail view." },
};
