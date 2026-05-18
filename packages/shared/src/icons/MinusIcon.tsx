import React from "react";
import { Icon, IconProps } from "./Icon";

export const MinusIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <line x1="5" y1="12" x2="19" y2="12" />
  </Icon>
);
