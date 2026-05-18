import React from 'react';

interface Props {
  search: string;
  total: number;
  onSearchChange: (value: string) => void;
}

const Toolbar: React.FC<Props> = ({ search, total, onSearchChange }) => {
  return (
    <div className="grid grid-cols-1 gap-x-3 gap-y-2 items-end">
      <div className="flex flex-col gap-1">
        <label htmlFor="vr-search" className="text-sm text-vr-text-muted font-semibold">
          Buscar produto
        </label>
        <input
          id="vr-search"
          type="search"
          value={search}
          placeholder="Ex.: notebook, perfume..."
          className="px-3 py-2.5 rounded-md border border-vr-border bg-vr-surface text-base text-vr-text transition-[border-color,box-shadow] duration-150 focus:outline-none focus:border-vr-primary focus:shadow-[0_0_0_3px_rgba(0,199,60,0.2)]"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="text-sm text-vr-text-muted text-right" aria-live="polite">
        {total > 0 ? `${total} produto${total === 1 ? '' : 's'}` : ''}
      </div>
    </div>
  );
};

export default Toolbar;
