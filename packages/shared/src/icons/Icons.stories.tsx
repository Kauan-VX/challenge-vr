import type { Meta, StoryObj } from "@storybook/react";
import {
  CartIcon,
  CloseIcon,
  MinusIcon,
  PackageIcon,
  PlusIcon,
  ReturnIcon,
  SearchIcon,
  ShieldIcon,
  StarIcon,
  TrashIcon,
  TruckIcon,
} from "./index";

const icons = [
  { name: "CartIcon", Component: CartIcon },
  { name: "CloseIcon", Component: CloseIcon },
  { name: "SearchIcon", Component: SearchIcon },
  { name: "StarIcon", Component: StarIcon },
  { name: "PlusIcon", Component: PlusIcon },
  { name: "MinusIcon", Component: MinusIcon },
  { name: "TrashIcon", Component: TrashIcon },
  { name: "PackageIcon", Component: PackageIcon },
  { name: "TruckIcon", Component: TruckIcon },
  { name: "ShieldIcon", Component: ShieldIcon },
  { name: "ReturnIcon", Component: ReturnIcon },
];

const Gallery = ({ size, stroke }: { size: number; stroke: number }) => (
  <ul
    style={{
      listStyle: "none",
      margin: 0,
      padding: 24,
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
      gap: 16,
    }}
  >
    {icons.map(({ name, Component }) => (
      <li
        key={name}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          padding: 16,
          borderRadius: 8,
          background: "#fff",
          border: "1px solid #dde4dc",
          color: "#111613",
        }}
      >
        <Component size={size} strokeWidth={stroke} aria-label={name} />
        <span style={{ fontSize: 12, fontFamily: "monospace" }}>{name}</span>
      </li>
    ))}
  </ul>
);

const meta: Meta<typeof Gallery> = {
  title: "Shared/Icons",
  component: Gallery,
  parameters: { layout: "fullscreen" },
  argTypes: {
    size: { control: { type: "range", min: 12, max: 64, step: 2 } },
    stroke: { control: { type: "range", min: 1, max: 4, step: 0.25 } },
  },
};

export default meta;
type Story = StoryObj<typeof Gallery>;

export const Default: Story = {
  args: { size: 24, stroke: 2 },
};
