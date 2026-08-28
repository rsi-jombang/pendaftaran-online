import { useState, useEffect, type RefObject } from "react";
import { Search, X } from "lucide-react";

interface PoliSearchFilterProps {
  onSearchChange: (searchTerm: string) => void;
  inputRef?: RefObject<HTMLInputElement | null>;
}

export function PoliSearchFilter({
  onSearchChange,
  inputRef,
}: PoliSearchFilterProps) {
  const [searchValue, setSearchValue] = useState("");

  // Debounce search dengan ~300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(searchValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, onSearchChange]);

  return (
    <div className="relative flex-1">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />
      <input
        ref={inputRef}
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Cari nama poli..."
        aria-label="Cari poli"
        className="w-full rounded-full border-2 border-border bg-surface py-3 pl-11 pr-12 text-body text-text-primary placeholder:text-text-secondary/70 transition-all focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
      />
      {searchValue ? (
        <button
          onClick={() => setSearchValue("")}
          aria-label="Hapus pencarian"
          className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
        >
          <X className="h-4 w-4" />
        </button>
      ) : (
        <kbd
          aria-hidden
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-border bg-surface-muted px-1.5 py-0.5 font-mono text-[11px] leading-none text-text-secondary"
        >
          /
        </kbd>
      )}
    </div>
  );
}
