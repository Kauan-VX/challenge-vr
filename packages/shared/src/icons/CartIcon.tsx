import React from "react";
import { Icon, IconProps } from "./Icon";

export const CartIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <circle cx="9" cy="20" r="1.5" />
    <circle cx="18" cy="20" r="1.5" />
    <path d="M2 3h3l2.4 12.3a2 2 0 0 0 2 1.7h8.7a2 2 0 0 0 2-1.6L22 7H6" />
  </Icon>
);
