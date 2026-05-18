import React, { useEffect, useState } from "react";
import { useFiltersStore, SearchIcon, CloseIcon } from "@vr/shared";

const HeaderSearch: React.FC = () => {
  const storedSearch = useFiltersStore((s) => s.search);
  const setSearch = useFiltersStore((s) => s.setSearch);
  const [value, setValue] = useState(storedSearch);

  useEffect(() => {
    setValue(storedSearch);
  }, [storedSearch]);

  useEffect(() => {
    const id = setTimeout(() => {
      if (value !== storedSearch) setSearch(value);
    }, 300);
    return () => clearTimeout(id);
  }, [value, storedSearch, setSearch]);

  const handleClear = () => {
    setValue("");
    setSearch("");
  };

  return (
    <form
      role="search"
      className="flex-1 min-w-0"
      onSubmit={(e) => {
        e.preventDefault();
        setSearch(value);
      }}
    >
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-vr-text-muted pointer-events-none">
          <SearchIcon size={18} />
        </span>
        <input
          id="vr-header-search"
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Buscar produtos, marcas e categorias..."
          aria-label="Buscar produtos"
          data-testid="header-search-input"
          className="w-full pl-10 pr-10 py-2.5 rounded-full border border-vr-border bg-vr-surface text-base text-vr-text transition-[border-color,box-shadow] duration-150 focus:outline-none focus:border-vr-primary focus:shadow-[0_0_0_3px_rgba(0,199,60,0.2)] [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Limpar busca"
            className="absolute right-2 top-1/2 -translate-y-1/2 inline-grid place-items-center w-7 h-7 rounded-full text-vr-text-muted hover:bg-vr-surface-alt hover:text-vr-text"
          >
            <CloseIcon size={14} />
          </button>
        )}
      </div>
    </form>
  );
};

export default HeaderSearch;
