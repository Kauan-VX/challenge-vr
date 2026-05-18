import { type RefObject, useEffect } from "react";

interface ModalControlsOptions {
  containerRef: RefObject<HTMLElement | null>;
  onClose: () => void;
}

export function useModalControls({ containerRef, onClose }: ModalControlsOptions): void {
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    containerRef.current?.focus();

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousBodyOverflow;
      previouslyFocused?.focus?.();
    };
  }, [containerRef, onClose]);
}
