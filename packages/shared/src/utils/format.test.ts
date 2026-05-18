import { formatPrice, humanizeSlug } from "./format";

describe("formatPrice", () => {
  it("formata em real brasileiro", () => {
    const result = formatPrice(1234.5);
    expect(result.replace(/\s/g, " ")).toMatch(/R\$\s?1\.234,50/);
  });

  it("formata zero", () => {
    expect(formatPrice(0).replace(/\s/g, " ")).toMatch(/R\$\s?0,00/);
  });
});

describe("humanizeSlug", () => {
  it("converte kebab-case", () => {
    expect(humanizeSlug("mens-shoes")).toBe("Mens shoes");
  });

  it("converte snake_case", () => {
    expect(humanizeSlug("skin_care")).toBe("Skin care");
  });

  it("mantem palavras unicas capitalizadas", () => {
    expect(humanizeSlug("groceries")).toBe("Groceries");
  });

  it("lida com valores vazios ou nulos", () => {
    expect(humanizeSlug("")).toBe("");
    expect(humanizeSlug(undefined)).toBe("");
    expect(humanizeSlug(null)).toBe("");
  });
});
