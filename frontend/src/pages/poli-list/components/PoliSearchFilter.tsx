import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "../../../shared/components/ui/Input";

interface PoliSearchFilterProps {
  onSearchChange: (searchTerm: string) => void;
  onCategoryChange: (category: string) => void;
  selectedCategory: string;
  categories: string[];
}

export function PoliSearchFilter({
  onSearchChange,
  onCategoryChange,
  selectedCategory,
  categories,
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
    <div className="space-y-4 mb-8">
      {/* Search Box */}
      <Input
        label="Cari Poli"
        placeholder="Ketik nama poli..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        leadingIcon={<Search className="w-5 h-5" />}
      />

      {/* Category Filter */}
      <div>
        <label
          className="block text-label mb-2 uppercase"
          style={{ color: "var(--color-text-primary)" }}
        >
          Kategori
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryChange("all")}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all"
            style={{
              backgroundColor:
                selectedCategory === "all"
                  ? "var(--color-primary)"
                  : "var(--color-surface)",
              color:
                selectedCategory === "all"
                  ? "var(--color-surface)"
                  : "var(--color-text-primary)",
              border: selectedCategory === "all" ? "none" : "2px solid var(--color-border)",
            }}
          >
            Semua
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                backgroundColor:
                  selectedCategory === category
                    ? "var(--color-primary)"
                    : "var(--color-surface)",
                color:
                  selectedCategory === category
                    ? "var(--color-surface)"
                    : "var(--color-text-primary)",
                border:
                  selectedCategory === category ? "none" : "2px solid var(--color-border)",
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
