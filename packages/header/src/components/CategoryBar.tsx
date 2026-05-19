import React, { useEffect, useRef, useState } from "react";
import { translateCategory, useCategories, useFiltersStore } from "@vr/shared";

const SCROLL_STEP = 240;

const CategoryBar: React.FC = () => {
  const category = useFiltersStore((s) => s.category);
  const setCategory = useFiltersStore((s) => s.setCategory);
  const { data: items, isPending, error } = useCategories();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => updateArrows();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateArrows);
    };
  }, [items]);

  const scrollBy = (delta: number) => {
    trackRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  const handleSelect = (slug: string) => {
    setCategory(category === slug ? null : slug);
  };

  if (error) return null;

  return (
    <nav
      className="group bg-vr-primary-soft text-vr-primary-strong border-t border-vr-border"
      aria-label="Categorias"
      data-testid="category-bar"
    >
      <div className="relative mx-auto max-w-vr-content px-2 sm:px-3">
        {canScrollLeft && (
          <>
            <div
              className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 z-5 bg-linear-to-r from-vr-primary-soft to-transparent"
              aria-hidden="true"
              data-testid="category-fade-left"
            />
            <button
              type="button"
              onClick={() => scrollBy(-SCROLL_STEP)}
              aria-label="Categorias anteriores"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 inline-grid place-items-center w-8 h-8 rounded-full bg-vr-primary-soft text-vr-primary-strong shadow-(--shadow-vr-sm) opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity hover:bg-vr-primary hover:text-white"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          </>
        )}
        {canScrollRight && (
          <>
            <div
              className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 z-5 bg-linear-to-l from-vr-primary-soft to-transparent"
              aria-hidden="true"
              data-testid="category-fade-right"
            />
            <button
              type="button"
              onClick={() => scrollBy(SCROLL_STEP)}
              aria-label="Próximas categorias"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 inline-grid place-items-center w-8 h-8 rounded-full bg-vr-primary-soft text-vr-primary-strong shadow-(--shadow-vr-sm) opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity hover:bg-vr-primary hover:text-white"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
        )}
        <div
          ref={trackRef}
          className="flex gap-1 overflow-x-auto scroll-smooth py-1.5 px-8 scrollbar-none [&::-webkit-scrollbar]:hidden"
        >
          <button
            type="button"
            onClick={() => setCategory(null)}
            aria-pressed={category === null ? "true" : "false"}
            data-testid="category-all"
            className={
              category === null
                ? "shrink-0 px-3 py-1.5 text-sm font-bold rounded-md bg-vr-primary text-white"
                : "shrink-0 px-3 py-1.5 text-sm font-semibold rounded-md text-vr-primary-strong hover:bg-vr-primary/15 transition-all duration-200 ease-out hover:scale-[1.03] active:scale-100"
            }
          >
            Todos
          </button>
          {isPending || !items
            ? Array.from({ length: 8 }).map((_, i) => (
                <span
                  key={i}
                  className="shrink-0 h-7 w-24 rounded-md bg-vr-primary/10 animate-vr-shimmer"
                  aria-hidden="true"
                />
              ))
            : items.map((c) => {
                const active = category === c.slug;
                return (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => handleSelect(c.slug)}
                    aria-pressed={active ? "true" : "false"}
                    data-testid={`category-${c.slug}`}
                    className={
                      active
                        ? "shrink-0 px-3 py-1.5 text-sm font-bold rounded-md bg-vr-primary text-white"
                        : "shrink-0 px-3 py-1.5 text-sm font-semibold rounded-md text-vr-primary-strong hover:bg-vr-primary/15 transition-all duration-200 ease-out hover:scale-[1.03] active:scale-100"
                    }
                  >
                    {translateCategory(c.slug)}
                  </button>
                );
              })}
        </div>
      </div>
    </nav>
  );
};

export default CategoryBar;
