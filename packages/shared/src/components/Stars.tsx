import React from "react";
import { StarIcon } from "../icons";

interface StarsProps {
  value: number;
  size?: number;
  className?: string;
}

export const Stars: React.FC<StarsProps> = ({ value, size = 14, className }) => {
  const filled = Math.round(value);
  return (
    <span
      className={
        className
          ? `inline-flex items-center gap-0.5 ${className}`
          : "inline-flex items-center gap-0.5"
      }
      aria-label={`${value} estrelas`}
    >
      {[1, 2, 3, 4, 5].map((position) => (
        <span
          key={position}
          className={position <= filled ? "text-amber-500" : "text-vr-border"}
          aria-hidden="true"
        >
          <StarIcon size={size} />
        </span>
      ))}
    </span>
  );
};
