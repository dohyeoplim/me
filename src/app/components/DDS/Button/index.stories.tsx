import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowRight, User } from "lucide-react";
import { expect, fn, userEvent, within } from "storybook/test";
import Button, { ButtonLink } from ".";

const meta = {
    title: "DDS/Button",
    component: Button,
    args: { children: "Button", onClick: fn() },
    argTypes: {
        variant: { control: "select", options: ["solid", "outline", "text"] },
        size: { control: "select", options: ["small", "medium", "large"] },
        disabled: { control: "boolean" },
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Solid: Story = {};
export const Outline: Story = { args: { variant: "outline" } };
export const Text: Story = { args: { variant: "text" } };
export const Small: Story = { args: { size: "small" } };
export const Large: Story = { args: { size: "large" } };
export const Disabled: Story = { args: { disabled: true } };
export const Selected: Story = { args: { variant: "outline", "aria-pressed": true, children: "Saved" } };
export const LongLabel: Story = {
    args: { variant: "outline", children: "Download the complete research report" },
    decorators: [(Story) => <div className="dds-narrow-example"><Story /></div>],
};
export const Link: Story = {
    render: () => <ButtonLink href="/portfolio" variant="outline">View portfolio</ButtonLink>,
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByRole("link", { name: "View portfolio" }))
            .toHaveAttribute("href", "/portfolio");
    },
};
export const RightIcon: Story = {
    args: {
        children: (
            <>
                Continue <ArrowRight size={16} aria-hidden="true" />
            </>
        ),
    },
};
export const LeftIcon: Story = {
    args: {
        children: (
            <>
                <User size={16} aria-hidden="true" /> Profile
            </>
        ),
    },
};

export const Keyboard: Story = {
    play: async ({ canvasElement, args }) => {
        const button = within(canvasElement).getByRole("button");
        button.focus();
        await expect(button).toHaveFocus();
        await userEvent.keyboard("{Enter}");
        await expect(args.onClick).toHaveBeenCalledOnce();
    },
};

export const DisabledInteraction: Story = {
    args: { disabled: true },
    play: async ({ canvasElement, args }) => {
        const button = within(canvasElement).getByRole("button");
        await expect(button).toBeDisabled();
        button.click();
        await expect(args.onClick).not.toHaveBeenCalled();
    },
};
