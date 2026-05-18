import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useCartStore } from "@vr/shared";
import type { Product } from "@vr/shared";
import ProductDetailModal from "../components/ProductDetailModal";

const product: Product = {
  id: 1,
  title: "Essence Mascara Lash Princess",
  description: "Mascara conhecida pelo seu efeito volumoso.",
  category: "beauty",
  price: 9.99,
  discountPercentage: 10,
  rating: 2.5,
  stock: 99,
  tags: ["beauty", "mascara"],
  brand: "Essence",
  sku: "BEA-ESS-001",
  weight: 4,
  dimensions: { width: 15, height: 13, depth: 22 },
  warrantyInformation: "1 semana de garantia",
  shippingInformation: "Envio em 3-5 dias",
  availabilityStatus: "In Stock",
  reviews: [
    {
      rating: 4,
      comment: "Muito bom!",
      date: "2025-04-30T09:41:02.053Z",
      reviewerName: "Lucas Gordon",
      reviewerEmail: "lucas@x.com",
    },
  ],
  returnPolicy: "Sem devolução",
  minimumOrderQuantity: 48,
  thumbnail: "https://cdn.dummyjson.com/products/1/thumbnail.webp",
  images: [
    "https://cdn.dummyjson.com/products/1/1.webp",
    "https://cdn.dummyjson.com/products/1/2.webp",
  ],
};

beforeEach(() => {
  useCartStore.setState({ items: [], isOpen: false });
});

describe("ProductDetailModal", () => {
  it("renderiza titulo, categoria traduzida, marca e descrição", () => {
    render(<ProductDetailModal product={product} onClose={jest.fn()} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: product.title })).toBeInTheDocument();
    expect(screen.getByText("Beleza")).toBeInTheDocument();
    expect(screen.getByText("Essence")).toBeInTheDocument();
    expect(screen.getByText(/volumoso/i)).toBeInTheDocument();
  });

  it("mostra preço com desconto, valor original e economia", () => {
    render(<ProductDetailModal product={product} onClose={jest.fn()} />);
    expect(screen.getByText(/R\$\s?8,99/)).toBeInTheDocument();
    expect(screen.getByText(/R\$\s?9,99/)).toBeInTheDocument();
    expect(screen.getByText(/Você economiza/i)).toBeInTheDocument();
  });

  it("indica pedido mínimo quando minimumOrderQuantity > 1", () => {
    render(<ProductDetailModal product={product} onClose={jest.fn()} />);
    expect(screen.getByText(/Pedido mínimo: 48/i)).toBeInTheDocument();
  });

  it("renderiza miniaturas quando há múltiplas imagens", async () => {
    render(<ProductDetailModal product={product} onClose={jest.fn()} />);
    const thumbs = screen.getByTestId("detail-thumbs");
    expect(within(thumbs).getAllByRole("button")).toHaveLength(2);
  });

  it("mostra reviews com nome, comentário e estrelas", () => {
    render(<ProductDetailModal product={product} onClose={jest.fn()} />);
    expect(screen.getByText("Lucas Gordon")).toBeInTheDocument();
    expect(screen.getByText("Muito bom!")).toBeInTheDocument();
  });

  it("adiciona ao carrinho via botão do modal", async () => {
    const user = userEvent.setup();
    render(<ProductDetailModal product={product} onClose={jest.fn()} />);
    await user.click(screen.getByTestId("detail-add-1"));
    expect(useCartStore.getState().items).toHaveLength(1);
  });

  it("fecha ao pressionar Escape", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(<ProductDetailModal product={product} onClose={onClose} />);
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });

  it("fecha ao clicar no botão de fechar", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(<ProductDetailModal product={product} onClose={onClose} />);
    await user.click(screen.getByTestId("detail-close"));
    expect(onClose).toHaveBeenCalled();
  });

  it("renderiza especificações quando disponíveis (SKU, peso, dimensões, barcode)", () => {
    render(
      <ProductDetailModal
        product={{
          ...product,
          meta: { createdAt: "", updatedAt: "", barcode: "12345", qrCode: "" },
        }}
        onClose={jest.fn()}
      />,
    );
    expect(screen.getByText("BEA-ESS-001")).toBeInTheDocument();
    expect(screen.getByText("4g")).toBeInTheDocument();
    expect(screen.getByText(/15 × 13 × 22 cm/)).toBeInTheDocument();
    expect(screen.getByText("12345")).toBeInTheDocument();
  });
});
