import React from "react";
import { Icon, IconProps } from "./Icon";

export const ReturnIcon: React.FC<IconProps> = (props) => (
  <Icon {...props}>
    <path d="M3 7v6h6" />
    <path d="M21 17a9 9 0 0 0-15-6.7L3 13" />
  </Icon>
);
