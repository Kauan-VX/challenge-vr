import type { Meta, StoryObj } from "@storybook/react";
import type { CartItem } from "@vr/shared";
import Header from "./Header";

const itensSeed: CartItem[] = [
  {
    id: 1,
    title: "Tenis Esportivo Performance",
    price: 199.9,
    thumbnail:
      "https://cdn.dummyjson.com/products/images/mens-shoes/Calvin%20Klein%20Slip%20On%20Loafers/thumbnail.png",
    quantity: 2,
  },
  {
    id: 2,
    title: "Mochila Urbana",
    price: 89.5,
    thumbnail:
      "https://cdn.dummyjson.com/products/images/mens-bags/Brown%20Leather%20Bag/thumbnail.png",
    quantity: 1,
  },
];

const meta: Meta<typeof Header> = {
  title: "Header/Header",
  component: Header,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Vazio: Story = {
  parameters: { cart: { items: [], isOpen: false } },
};

export const ComItens: Story = {
  parameters: { cart: { items: itensSeed, isOpen: false } },
};

export const ModalAberto: Story = {
  parameters: { cart: { items: itensSeed, isOpen: true } },
};

export const ComCategoriaSelecionada: Story = {
  parameters: {
    cart: { items: itensSeed, isOpen: false },
    filters: { search: "", category: "beauty" },
  },
};
