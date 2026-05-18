const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

export function formatPrice(value: number): string {
  return currencyFormatter.format(value);
}

export function humanizeSlug(value: string | undefined | null): string {
  if (!value) return "";
  const normalized = value.replace(/[-_]+/g, " ").trim().toLowerCase();
  if (!normalized) return "";
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}
