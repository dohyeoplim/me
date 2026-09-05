import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Reveal from ".";
import Surface from "../Surface";

const meta = {
    title: "DDS/Reveal",
    component: Reveal,
    args: { children: <Surface className="p-dds-2xl">Room to arrive.</Surface> },
} satisfies Meta<typeof Reveal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
