import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import TextField from ".";

const meta = {
    title: "DDS/TextField",
    component: TextField,
    args: {
        label: "Email address",
        hint: "Use the address associated with your account.",
        placeholder: "name@example.com",
    },
    argTypes: {
        variant: { control: "select", options: ["outlined", "line"] },
        size: { control: "select", options: ["medium", "large"] },
        invalid: { control: "boolean" },
        disabled: { control: "boolean" },
    },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Outlined: Story = {};
export const Line: Story = { args: { variant: "line" } };
export const Medium: Story = { args: { size: "medium" } };
export const Large: Story = { args: { size: "large" } };
export const Password: Story = {
    args: {
        label: "Password",
        hint: "Enter your account password.",
        type: "password",
        autoComplete: "current-password",
        defaultValue: "correct-horse-battery-staple",
    },
};
export const Error: Story = {
    args: {
        defaultValue: "name@example",
        error: "Enter a complete email address.",
    },
};
export const Disabled: Story = {
    args: {
        disabled: true,
        defaultValue: "name@example.com",
    },
};
export const KeyboardFocus: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await userEvent.tab();
        await expect(canvas.getByRole("textbox", { name: "Email address" })).toHaveFocus();
    },
};
