import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CartIcon, CloseIcon, StarIcon, PlusIcon, MinusIcon, SearchIcon } from "./index";

const icons = [
  { name: "CartIcon", Component: CartIcon },
  { name: "CloseIcon", Component: CloseIcon },
  { name: "StarIcon", Component: StarIcon },
  { name: "PlusIcon", Component: PlusIcon },
  { name: "MinusIcon", Component: MinusIcon },
  { name: "SearchIcon", Component: SearchIcon },
] as const;

interface ShowcaseProps {
  size?: number;
  tone?: "default" | "primary";
}

const Showcase: React.FC<ShowcaseProps> = ({ size = 28, tone = "default" }) => (
  <ul
    className={`list-none m-0 p-4 grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3 ${
      tone === "primary" ? "text-vr-primary" : "text-vr-text"
    }`}
  >
    {icons.map(({ name, Component }) => (
      <li
        key={name}
        className="border border-vr-border rounded-xl p-4 flex flex-col items-center gap-2 bg-vr-surface"
      >
        <Component size={size} />
        <code className="text-xs text-vr-text-muted">{name}</code>
      </li>
    ))}
  </ul>
);

const meta: Meta<typeof Showcase> = {
  title: "Design System/Icones",
  component: Showcase,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof Showcase>;

export const Padrao: Story = { args: { size: 28, tone: "default" } };
export const Pequeno: Story = { args: { size: 16, tone: "default" } };
export const Grande: Story = { args: { size: 48, tone: "default" } };
export const NaCorPrimaria: Story = { args: { size: 28, tone: "primary" } };
