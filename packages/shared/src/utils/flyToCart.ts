export interface FlyToCartOptions {
  imageUrl: string;
  source: DOMRect | { top: number; left: number; width: number; height: number };
  duration?: number;
}

const CART_TARGET_SELECTOR = "[data-cart-target]";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function flyToCart({ imageUrl, source, duration = 750 }: FlyToCartOptions): boolean {
  if (typeof document === "undefined") return false;
  if (prefersReducedMotion()) return false;

  const targetEl = document.querySelector(CART_TARGET_SELECTOR) as HTMLElement | null;
  if (!targetEl) return false;
  const target = targetEl.getBoundingClientRect();

  const el = document.createElement("div");
  el.setAttribute("aria-hidden", "true");
  el.dataset.flying = "true";
  Object.assign(el.style, {
    position: "fixed",
    top: `${source.top}px`,
    left: `${source.left}px`,
    width: `${source.width}px`,
    height: `${source.height}px`,
    backgroundImage: `url("${imageUrl.replace(/"/g, '\\"')}")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundColor: "var(--color-vr-surface-alt, #eef2ee)",
    borderRadius: "12px",
    pointerEvents: "none",
    zIndex: "9999",
    boxShadow: "0 12px 28px rgba(20, 24, 35, 0.22)",
    willChange: "transform, opacity",
  });

  document.body.appendChild(el);

  const startX = source.left + source.width / 2;
  const startY = source.top + source.height / 2;
  const endX = target.left + target.width / 2;
  const endY = target.top + target.height / 2;
  const dx = endX - startX;
  const dy = endY - startY;
  // altura do arco proporcional à distância vertical, com piso e teto
  // pra que cards perto do header não façam um arco minúsculo e cards
  // muito abaixo do fold não voem alto demais
  const arcLift = Math.max(120, Math.min(280, Math.abs(dy) * 0.5));

  const anim = el.animate(
    [
      { transform: "translate(0,0) scale(1) rotate(0deg)", opacity: 1, offset: 0 },
      {
        transform: `translate(${dx * 0.5}px, ${dy * 0.4 - arcLift}px) scale(0.55) rotate(8deg)`,
        opacity: 0.95,
        offset: 0.55,
      },
      {
        transform: `translate(${dx}px, ${dy}px) scale(0.1) rotate(18deg)`,
        opacity: 0,
        offset: 1,
      },
    ],
    { duration, easing: "cubic-bezier(0.5, 0.1, 0.4, 1)", fill: "forwards" },
  );

  const cleanup = () => el.remove();
  anim.onfinish = () => {
    cleanup();
    targetEl.classList.add("vr-cart-bump");
    setTimeout(() => targetEl.classList.remove("vr-cart-bump"), 320);
  };
  anim.oncancel = cleanup;

  return true;
}
