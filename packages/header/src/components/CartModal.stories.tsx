import type { Meta, StoryObj } from "@storybook/react";
import type { CartItem } from "@vr/shared";
import CartModal from "./CartModal";

const itens: CartItem[] = [
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
    title: "Mochila Urbana com porta-notebook",
    price: 89.5,
    thumbnail:
      "https://cdn.dummyjson.com/products/images/mens-bags/Brown%20Leather%20Bag/thumbnail.png",
    quantity: 1,
  },
  {
    id: 3,
    title: "Oculos de sol polarizado",
    price: 159,
    thumbnail:
      "https://cdn.dummyjson.com/products/images/sunglasses/Black%20Sun%20Glasses/thumbnail.png",
    quantity: 3,
  },
];

const meta: Meta<typeof CartModal> = {
  title: "Header/CartModal",
  component: CartModal,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof CartModal>;

export const Vazio: Story = {
  parameters: { cart: { items: [], isOpen: true } },
};

export const ComItens: Story = {
  parameters: { cart: { items: itens, isOpen: true } },
};
