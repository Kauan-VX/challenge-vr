import React from "react";
import { render, screen, within } from "@testing-library/react";
import Footer from "../Footer";

describe("Footer", () => {
  it("expoe o landmark contentinfo com nav rotulado", () => {
    render(<Footer />);
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
    expect(within(footer).getByRole("navigation", { name: /rodape/i })).toBeInTheDocument();
  });

  it("renderiza tres secoes (Produto, Empresa, Suporte) como headings de nivel 3", () => {
    render(<Footer />);
    const nav = screen.getByRole("navigation", { name: /rodape/i });
    const headings = within(nav).getAllByRole("heading", { level: 3 });
    expect(headings.map((h) => h.textContent)).toEqual(["Produto", "Empresa", "Suporte"]);
  });

  it("cada secao do nav agrupa 3 links navegaveis", () => {
    render(<Footer />);
    const nav = screen.getByRole("navigation", { name: /rodape/i });
    const links = within(nav).getAllByRole("link");
    expect(links).toHaveLength(9);
    for (const link of links) {
      expect(link).toHaveAttribute("href");
    }
  });

  it("logo tem texto alternativo acessivel", () => {
    render(<Footer />);
    const logo = screen.getByRole("img", { name: /vr/i });
    expect(logo).toHaveAttribute("width", "48");
    expect(logo).toHaveAttribute("height", "48");
  });

  it("copyright exibe ano corrente e marca da empresa", () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`©\\s*${year}\\s+VR Beneficios`, "i"))).toBeInTheDocument();
  });
});
