import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "../../../shared/components/ui/Input";

interface PoliSearchFilterProps {
  onSearchChange: (searchTerm: string) => void;
  onCategoryChange?: (category: string) => void;
  selectedCategory?: string;
  categories?: string[];
}

export function PoliSearchFilter({
  onSearchChange,
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
    </div>
  );
}