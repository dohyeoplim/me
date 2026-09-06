import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Sheet from ".";
import Button from "../Button";

const meta = {
    title: "DDS/Sheet", component: Sheet,
    args: { open: false, title: "Details", onClose: () => {}, children: <p>Selected item content.</p> },
    render: function Example(args) {
        const [open, setOpen] = useState(false);
        return <><Button variant="outline" onClick={() => setOpen(true)}>View details</Button>
            <Sheet {...args} open={open} onClose={() => setOpen(false)} /></>;
    },
} satisfies Meta<typeof Sheet>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Wide: Story = { args: { size: "wide" } };
export const LongContent: Story = {
    args: { children: Array.from({ length: 30 }, (_, index) => <p key={index}>Selected item content.</p>) },
};
