import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import type { Product } from "@vr/shared";
import ProductCard from "./ProductCard";

const baseProduct: Product = {
  id: 1,
  title: "Essence Mascara Lash Princess",
  description:
    "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects.",
  price: 9.99,
  discountPercentage: 10.48,
  rating: 2.56,
  stock: 99,
  brand: "Essence",
  category: "beauty",
  thumbnail:
    "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp",
  images: [],
};

const meta: Meta<typeof ProductCard> = {
  title: "Cards/ProductCard",
  component: ProductCard,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div style={{ width: 260 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProductCard>;

export const ComDesconto: Story = {
  args: { product: baseProduct },
};

export const SemDesconto: Story = {
  args: {
    product: { ...baseProduct, discountPercentage: 0 },
  },
};

export const EstoqueBaixo: Story = {
  args: {
    product: { ...baseProduct, stock: 4 },
  },
};

export const SemEstoque: Story = {
  args: {
    product: { ...baseProduct, stock: 0 },
  },
};

export const NoCarrinhoUmaUnidade: Story = {
  args: { product: baseProduct },
  parameters: {
    cart: {
      items: [
        {
          id: baseProduct.id,
          title: baseProduct.title,
          price: baseProduct.price,
          thumbnail: baseProduct.thumbnail,
          quantity: 1,
        },
      ],
    },
  },
};

export const NoCarrinhoMultiplo: Story = {
  args: { product: baseProduct },
  parameters: {
    cart: {
      items: [
        {
          id: baseProduct.id,
          title: baseProduct.title,
          price: baseProduct.price,
          thumbnail: baseProduct.thumbnail,
          quantity: 3,
        },
      ],
    },
  },
};
