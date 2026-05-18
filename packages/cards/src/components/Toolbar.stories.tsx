import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Toolbar from "./Toolbar";

const meta: Meta<typeof Toolbar> = {
  title: "Cards/Toolbar",
  component: Toolbar,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 520, padding: 24, background: "#f6f8f6" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Toolbar>;

export const Padrao: Story = {
  args: { search: "", total: 0, onSearchChange: () => undefined },
};

export const ComResultados: Story = {
  args: { search: "tenis", total: 32, onSearchChange: () => undefined },
};

const InteractiveToolbar: React.FC<{ initial: string; total: number }> = ({ initial, total }) => {
  const [value, setValue] = useState(initial);
  return <Toolbar search={value} total={total} onSearchChange={setValue} />;
};

export const Interativo: Story = {
  render: () => <InteractiveToolbar initial="" total={7} />,
};
