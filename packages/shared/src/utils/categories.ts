import { humanizeSlug } from "./format";

const CATEGORY_LABELS_PT_BR: Record<string, string> = {
  beauty: "Beleza",
  fragrances: "Perfumes",
  furniture: "Móveis",
  groceries: "Mercado",
  "home-decoration": "Decoração",
  "kitchen-accessories": "Cozinha",
  laptops: "Notebooks",
  "mens-shirts": "Camisas Masculinas",
  "mens-shoes": "Calçados Masculinos",
  "mens-watches": "Relógios Masculinos",
  "mobile-accessories": "Acessórios para Celular",
  motorcycle: "Motos",
  "skin-care": "Cuidados com a Pele",
  smartphones: "Smartphones",
  "sports-accessories": "Esportes",
  sunglasses: "Óculos de Sol",
  tablets: "Tablets",
  tops: "Blusas",
  vehicle: "Veículos",
  "womens-bags": "Bolsas Femininas",
  "womens-dresses": "Vestidos",
  "womens-jewellery": "Joias",
  "womens-shoes": "Calçados Femininos",
  "womens-watches": "Relógios Femininos",
};

export function translateCategory(slug: string): string {
  return CATEGORY_LABELS_PT_BR[slug] ?? humanizeSlug(slug);
}
