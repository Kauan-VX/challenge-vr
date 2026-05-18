import React from "react";
import { Icon, IconProps } from "./Icon";

export const CloseIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="6" y1="18" x2="18" y2="6" />
  </Icon>
);
