import React, { useEffect, useRef, useState } from "react";
import { useFiltersStore, SearchIcon, CloseIcon } from "@vr/shared";

const HeaderSearch: React.FC = () => {
  const storedSearch = useFiltersStore((s) => s.search);
  const setSearch = useFiltersStore((s) => s.setSearch);
  const [value, setValue] = useState(storedSearch);
  // ref evita re-entry entre os dois effects abaixo: o debounce escreve no
  // store -> storedSearch muda -> effect de sync poderia chamar setValue de
  // novo. Marcando o que nos mesmos escrevemos, o sync ignora.
  const lastWrittenRef = useRef(storedSearch);

  useEffect(() => {
    if (storedSearch === lastWrittenRef.current) return;
    lastWrittenRef.current = storedSearch;
    setValue(storedSearch);
  }, [storedSearch]);

  // 300ms: rápido o bastante pra parecer responsivo,
  // longo o bastante pra não disparar request a cada tecla
  useEffect(() => {
    if (value === storedSearch) return;
    const id = setTimeout(() => {
      lastWrittenRef.current = value;
      setSearch(value);
    }, 300);
    return () => clearTimeout(id);
  }, [value, storedSearch, setSearch]);

  const commit = (next: string) => {
    lastWrittenRef.current = next;
    setSearch(next);
  };

  const handleClear = () => {
    setValue("");
    commit("");
  };

  const hasValue = value.length > 0;

  return (
    <form
      role="search"
      className="flex-1 min-w-0 max-w-2xl mx-auto"
      onSubmit={(e) => {
        e.preventDefault();
        commit(value);
      }}
    >
      <div
        className={`group relative flex items-center rounded-full bg-vr-surface-alt border border-transparent transition-all duration-200 hover:bg-vr-surface hover:border-vr-border focus-within:bg-vr-surface focus-within:border-vr-primary focus-within:shadow-[0_0_0_4px_rgba(0,199,60,0.15)] ${hasValue ? "bg-vr-surface border-vr-border" : ""}`}
      >
        <span className="pl-4 pr-2 text-vr-text-muted group-focus-within:text-vr-primary transition-colors pointer-events-none">
          <SearchIcon size={18} />
        </span>
        <input
          id="vr-header-search"
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Buscar produtos"
          aria-label="Buscar produtos"
          data-testid="header-search-input"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          className="flex-1 min-w-0 py-2.5 pr-3 bg-transparent text-base text-vr-text placeholder:text-vr-text-muted focus:outline-none [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none"
        />
        {hasValue && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Limpar busca"
            title=""
            className="mr-2 inline-grid place-items-center w-7 h-7 rounded-full text-vr-text-muted hover:bg-vr-surface-alt hover:text-vr-text transition-colors"
          >
            <CloseIcon size={14} />
          </button>
        )}
      </div>
    </form>
  );
};

export default HeaderSearch;
