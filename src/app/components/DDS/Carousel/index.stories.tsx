import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Carousel from ".";
import Skeleton from "../Skeleton";

const meta = {
    title: "DDS/Carousel",
    component: Carousel,
    args: {
        label: "Selected work",
        children: Array.from({ length: 3 }, (_, index) => <Skeleton key={index} variant="media" />),
    },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const FullBleed: Story = {
    args: { variant: "full-bleed" },
    decorators: [(Story) => <div className="dds-container"><Story /></div>],
};
export const SingleItem: Story = { args: { children: <Skeleton variant="media" /> } };
