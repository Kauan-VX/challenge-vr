import React from "react";

interface Props {
  name: string;
  className?: string;
}

const RemoteFallback: React.FC<Props> = ({ name, className = "min-h-30" }) => (
  <div
    role="status"
    aria-live="polite"
    className={`grid place-items-center text-vr-text-muted text-sm p-4 ${className}`}
  >
    Carregando {name}...
  </div>
);

export default RemoteFallback;
