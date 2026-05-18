import React from "react";

export interface IconProps {
  className?: string;
  size?: number;
  strokeWidth?: number;
  title?: string;
  "aria-label"?: string;
  "aria-hidden"?: boolean | "true" | "false";
}

interface BaseProps extends IconProps {
  children: React.ReactNode;
  viewBox?: string;
  fill?: string;
}

/**
 * Componente base do design system de icones VR.
 *
 * Convencao:
 * - 24x24 viewBox, stroke `currentColor`, fill transparente — herdam cor/tamanho do contexto.
 * - Por padrao decorativos (`aria-hidden="true"`); passe `aria-label` quando o icone
 *   carregar o significado sozinho (ex.: botao apenas com icone sem texto visivel).
 */
export const Icon: React.FC<BaseProps> = ({
  className,
  size = 20,
  strokeWidth = 2,
  viewBox = "0 0 24 24",
  fill = "none",
  children,
  title,
  ...aria
}) => {
  const labelled = Boolean(aria["aria-label"] || title);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={viewBox}
      fill={fill}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={labelled ? "img" : undefined}
      aria-hidden={labelled ? undefined : (aria["aria-hidden"] ?? "true")}
      aria-label={aria["aria-label"]}
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  );
};
