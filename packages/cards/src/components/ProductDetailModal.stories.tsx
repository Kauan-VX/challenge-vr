import type { Meta, StoryObj } from "@storybook/react";
import type { Product } from "@vr/shared";
import ProductDetailModal from "./ProductDetailModal";

const baseProduct: Product = {
  id: 1,
  title: "Black Aluminium Cup",
  description:
    "The Black Aluminium Cup is a stylish and durable cup suitable for both hot and cold beverages. Its sleek black design adds a modern touch to your drinkware collection.",
  price: 5.99,
  discountPercentage: 16,
  rating: 4.5,
  stock: 75,
  brand: "Brand A",
  category: "kitchen-accessories",
  sku: "KIT-BRD-BLA-049",
  weight: 7,
  dimensions: { width: 5.88, height: 5.11, depth: 10.03 },
  warrantyInformation: "1 year warranty",
  shippingInformation: "Ships in 1 business day",
  availabilityStatus: "In Stock",
  returnPolicy: "30 days return policy",
  minimumOrderQuantity: 48,
  tags: ["drinkware", "cups"],
  thumbnail:
    "https://cdn.dummyjson.com/product-images/kitchen-accessories/black-aluminium-cup/thumbnail.webp",
  images: [
    "https://cdn.dummyjson.com/product-images/kitchen-accessories/black-aluminium-cup/1.webp",
    "https://cdn.dummyjson.com/product-images/kitchen-accessories/black-aluminium-cup/2.webp",
    "https://cdn.dummyjson.com/product-images/kitchen-accessories/black-aluminium-cup/3.webp",
  ],
  reviews: [
    {
      rating: 5,
      comment: "Excelente produto, recomendo!",
      date: "2025-04-30T09:41:02.053Z",
      reviewerName: "Alexander Hernandez",
      reviewerEmail: "alexander.h@example.com",
    },
    {
      rating: 4,
      comment: "Muito bom, chegou rápido e bem embalado.",
      date: "2025-04-28T14:12:00.000Z",
      reviewerName: "Aurora Rodriguez",
      reviewerEmail: "aurora.r@example.com",
    },
    {
      rating: 5,
      comment: "Qualidade impecável, mantém a temperatura por horas.",
      date: "2025-04-20T11:30:00.000Z",
      reviewerName: "Bruno Silva",
      reviewerEmail: "bruno.s@example.com",
    },
  ],
  meta: {
    createdAt: "2025-01-15T08:00:00.000Z",
    updatedAt: "2025-04-30T09:41:02.053Z",
    barcode: "5606164195748",
    qrCode: "",
  },
};

const meta: Meta<typeof ProductDetailModal> = {
  title: "Cards/ProductDetailModal",
  component: ProductDetailModal,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Modal de detalhes do produto. Suporta galeria com setas/contador/miniaturas, exibe especificações, garantia, frete, devolução e reviews quando disponíveis. Integra com o carrinho via store global.",
      },
    },
  },
  args: {
    onClose: () => {},
  },
  argTypes: {
    onClose: { action: "fechou" },
  },
};

export default meta;
type Story = StoryObj<typeof ProductDetailModal>;

export const Completo: Story = {
  args: { product: baseProduct },
};

export const ComMultiplasImagens: Story = {
  args: { product: baseProduct },
  parameters: {
    docs: {
      description: {
        story:
          "Setas aparecem no hover do banner, contador `1 / N` no canto inferior direito e tira de miniaturas embaixo. Navegação faz wraparound.",
      },
    },
  },
};

export const ImagemUnica: Story = {
  args: {
    product: {
      ...baseProduct,
      images: [baseProduct.images[0]],
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Com apenas uma imagem, setas, contador e miniaturas ficam ocultos.",
      },
    },
  },
};

export const SemDesconto: Story = {
  args: {
    product: { ...baseProduct, discountPercentage: 0 },
  },
};

export const SemEstoque: Story = {
  args: {
    product: { ...baseProduct, stock: 0, availabilityStatus: "Out of Stock" },
  },
  parameters: {
    docs: {
      description: {
        story: "Botão de CTA fica desabilitado e o tile de disponibilidade muda pra tom de perigo.",
      },
    },
  },
};

export const JaNoCarrinho: Story = {
  args: { product: baseProduct },
  parameters: {
    cart: {
      items: [
        {
          id: baseProduct.id,
          title: baseProduct.title,
          price: baseProduct.price,
          thumbnail: baseProduct.thumbnail,
          quantity: 2,
        },
      ],
    },
    docs: {
      description: {
        story: "Substitui o botão pelo `CartStepper` quando o produto já está no carrinho.",
      },
    },
  },
};

export const SemReviewsNemSpecs: Story = {
  args: {
    product: {
      id: 99,
      title: "Produto Minimalista",
      description: "Descrição enxuta sem dados extras.",
      price: 49.9,
      discountPercentage: 0,
      rating: 3,
      stock: 5,
      brand: "",
      category: "beauty",
      thumbnail: baseProduct.thumbnail,
      images: [baseProduct.images[0]],
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Seções de Especificações e Avaliações são condicionais — somem quando o produto não traz esses dados.",
      },
    },
  },
};
