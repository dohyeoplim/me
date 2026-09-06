import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import ButtonShowcase from ".";

const meta = {
    title: "DDS/Examples",
    component: ButtonShowcase,
    parameters: { layout: "padded" },
} satisfies Meta<typeof ButtonShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Buttons: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(within(canvasElement).getByRole("region", { name: "Interactive button examples" }));
        await userEvent.click(canvas.getByRole("button", { name: "Save" }));
        await expect(canvas.getByRole("button", { name: "Saved" })).toHaveAttribute("aria-pressed", "true");
        await userEvent.click(canvas.getByRole("button", { name: "Continue" }));
        await expect(canvas.getByRole("button", { name: "Done" })).toBeDisabled();
        await userEvent.click(canvas.getByRole("button", { name: "Toggle notifications" }));
        await expect(canvas.getByText("Notifications on")).toBeVisible();
        await userEvent.click(canvas.getByRole("button", { name: "Reset examples" }));
        await expect(canvas.getByRole("button", { name: "Continue" })).toBeEnabled();
        await expect(canvas.getByRole("button", { name: "Save" })).toHaveAttribute("aria-pressed", "false");
    },
};
