import type { Meta, StoryObj } from "@storybook/react";
import Footer from "./Footer";

const meta: Meta<typeof Footer> = {
  title: "Footer/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "light" },
  },
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Padrao: Story = {};
