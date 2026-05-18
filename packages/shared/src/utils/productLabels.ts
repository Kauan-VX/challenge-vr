const UNIT_PLURAL: Record<string, string> = {
  day: "dia",
  days: "dias",
  week: "semana",
  weeks: "semanas",
  month: "mês",
  months: "meses",
  year: "ano",
  years: "anos",
};

const AVAILABILITY_LABELS: Record<string, string> = {
  "in stock": "Em estoque",
  "low stock": "Estoque baixo",
  "out of stock": "Sem estoque",
};

export function translateAvailability(status: string | undefined): string {
  if (!status) return "";
  return AVAILABILITY_LABELS[status.toLowerCase()] ?? status;
}

export function translateWarranty(info: string | undefined): string {
  if (!info) return "";
  if (/lifetime/i.test(info)) return "Garantia vitalícia";
  const match = info.match(/(\d+)\s+(week|weeks|month|months|year|years|day|days)/i);
  if (!match) return info;
  const [, n, unit] = match;
  const num = Number(n);
  const key =
    num === 1
      ? unit.toLowerCase().replace(/s$/, "")
      : `${unit.toLowerCase()}${unit.endsWith("s") ? "" : "s"}`;
  return `${num} ${UNIT_PLURAL[key] ?? unit} de garantia`;
}

export function translateShipping(info: string | undefined): string {
  if (!info) return "";
  if (/overnight/i.test(info)) return "Envio em 1 dia útil";
  const businessMatch = info.match(/(\d+)[-–](\d+)\s+business\s+days?/i);
  if (businessMatch) return `Envio em ${businessMatch[1]}-${businessMatch[2]} dias úteis`;
  const inMatch = info.match(/in\s+(\d+)\s+(week|weeks|month|months|day|days)/i);
  if (inMatch) {
    const num = Number(inMatch[1]);
    const unit = inMatch[2].toLowerCase();
    const key = num === 1 ? unit.replace(/s$/, "") : unit.endsWith("s") ? unit : `${unit}s`;
    return `Envio em ${num} ${UNIT_PLURAL[key] ?? unit}`;
  }
  return info;
}

export function translateReturnPolicy(info: string | undefined): string {
  if (!info) return "";
  if (/no return/i.test(info)) return "Sem política de devolução";
  const match = info.match(/(\d+)\s+days?\s+return/i);
  if (!match) return info;
  const num = Number(match[1]);
  return `${num} ${num === 1 ? "dia" : "dias"} para devolução`;
}
