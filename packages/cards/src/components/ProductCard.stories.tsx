import type { Meta, StoryObj } from "@storybook/react";
import type { Product } from "@vr/shared";
import ProductCard from "./ProductCard";

const base: Product = {
  id: 1,
  title: "Tenis Esportivo Performance",
  description: "Confortavel, leve e ideal para corridas urbanas.",
  price: 250,
  discountPercentage: 0,
  rating: 4.5,
  stock: 12,
  brand: "VR Sports",
  category: "mens-shoes",
  thumbnail:
    "https://cdn.dummyjson.com/products/images/mens-shoes/Calvin%20Klein%20Slip%20On%20Loafers/thumbnail.png",
  images: [],
};

const meta: Meta<typeof ProductCard> = {
  title: "Cards/ProductCard",
  component: ProductCard,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 260, padding: 16, background: "#f6f8f6" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProductCard>;

export const Padrao: Story = { args: { product: base } };

export const ComDesconto: Story = {
  args: { product: { ...base, discountPercentage: 18, price: 320 } },
};

export const TituloLongo: Story = {
  args: {
    product: {
      ...base,
      title:
        "Tenis de Performance Premium com tecnologia de amortecimento adaptativo edicao limitada 2026",
      discountPercentage: 25,
    },
  },
};

export const SemImagem: Story = {
  args: { product: { ...base, thumbnail: "" } },
};
