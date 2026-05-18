import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useCartStore } from "@vr/shared";
import type { Product } from "@vr/shared";
import ProductCard from "../components/ProductCard";

const baseProduct: Product = {
  id: 42,
  title: "Mascara Beleza",
  description: "Confortavel e leve",
  price: 250,
  discountPercentage: 10,
  rating: 4.5,
  stock: 12,
  brand: "VR Cosmetics",
  category: "beauty",
  thumbnail: "https://dummyjson.com/image/i/products/42/thumbnail.jpg",
  images: [],
};

const renderCard = (product: Product = baseProduct, onOpenDetails?: (p: Product) => void) => {
  const utils = render(<ProductCard product={product} onOpenDetails={onOpenDetails} />);
  return { ...utils, user: userEvent.setup() };
};

beforeEach(() => {
  useCartStore.setState({ items: [], isOpen: false });
});

describe("ProductCard", () => {
  it("mostra titulo, marca e preco com desconto aplicado", () => {
    renderCard();
    expect(screen.getByRole("heading", { name: "Mascara Beleza" })).toBeInTheDocument();
    expect(screen.getByText("VR Cosmetics")).toBeInTheDocument();
    expect(screen.getByText(/R\$\s?225,00/)).toBeInTheDocument();
  });

  it("traduz a categoria para pt-BR no badge superior", () => {
    renderCard();
    expect(screen.getByText("Beleza")).toBeInTheDocument();
  });

  it("mostra badge com porcentagem de desconto quando aplicavel", () => {
    renderCard();
    expect(screen.getByLabelText("Desconto")).toHaveTextContent("-10%");
  });

  it("omite badge quando nao ha desconto", () => {
    renderCard({ ...baseProduct, discountPercentage: 0 });
    expect(screen.queryByLabelText("Desconto")).not.toBeInTheDocument();
  });

  it("dispara onOpenDetails ao clicar na imagem", async () => {
    const onOpen = jest.fn();
    const { user } = renderCard(baseProduct, onOpen);
    await user.click(screen.getByTestId("open-details-42"));
    expect(onOpen).toHaveBeenCalledWith(baseProduct);
  });

  it("dispara onOpenDetails ao clicar no titulo", async () => {
    const onOpen = jest.fn();
    const { user } = renderCard(baseProduct, onOpen);
    await user.click(screen.getByRole("button", { name: "Mascara Beleza" }));
    expect(onOpen).toHaveBeenCalledWith(baseProduct);
  });

  it("adiciona item ao carrinho ao clicar em adicionar", async () => {
    const { user } = renderCard();
    await user.click(screen.getByTestId("add-42"));
    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ id: 42, quantity: 1 });
  });

  it("ao ter 1 no carrinho mostra stepper com lixeira e contagem", async () => {
    const { user } = renderCard();
    await user.click(screen.getByTestId("add-42"));
    expect(screen.getByTestId("stepper-42")).toBeInTheDocument();
    expect(screen.getByTestId("stepper-count-42")).toHaveTextContent("1 no carrinho");
    expect(screen.getByTestId("remove-42")).toBeInTheDocument();
  });

  it("lixeira remove o produto do carrinho quando quantidade eh 1", async () => {
    const { user } = renderCard();
    await user.click(screen.getByTestId("add-42"));
    await user.click(screen.getByTestId("remove-42"));
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("ao ter 2 ou mais no carrinho mostra botao de menos no lugar da lixeira", async () => {
    const { user } = renderCard();
    await user.click(screen.getByTestId("add-42"));
    await user.click(screen.getByTestId("add-42"));
    expect(screen.getByTestId("stepper-count-42")).toHaveTextContent("2 no carrinho");
    expect(screen.getByTestId("decrement-42")).toBeInTheDocument();
    expect(screen.queryByTestId("remove-42")).not.toBeInTheDocument();
  });

  it("botao de menos reduz a quantidade", async () => {
    const { user } = renderCard();
    await user.click(screen.getByTestId("add-42"));
    await user.click(screen.getByTestId("add-42"));
    await user.click(screen.getByTestId("decrement-42"));
    expect(screen.getByTestId("stepper-count-42")).toHaveTextContent("1 no carrinho");
  });

  it("desabilita o + quando atinge o estoque", async () => {
    const { user } = renderCard({ ...baseProduct, stock: 2 });
    await user.click(screen.getByTestId("add-42"));
    await user.click(screen.getByTestId("add-42"));
    expect(screen.getByTestId("add-42")).toBeDisabled();
  });
});
