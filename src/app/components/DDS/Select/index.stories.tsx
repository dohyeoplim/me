import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Select from ".";

const meta = {
    title: "DDS/Select", component: Select,
    args: { "aria-label": "Category", defaultValue: "research",
        children: <><option value="research">Research</option><option value="project">Project</option></> },
    decorators: [(Story) => <div className="dds-narrow-example"><Story /></div>],
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const LongLabel: Story = { args: { children: <option>A longer category name within a narrow field</option> } };
