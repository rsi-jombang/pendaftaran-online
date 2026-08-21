import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "../../shared/components/ui";
import { EmptyState } from "../../shared/components/feedback";
import { PoliCard } from "./components/PoliCard";
import { PoliSearchFilter } from "./components/PoliSearchFilter";
import { usePoliList } from "../../features/poli";
import type { Poli } from "../../features/poli/types";

export function PoliListPage() {
  const navigate = useNavigate();
  const { data: poliData, isLoading } = usePoliList();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Extract unique categories dari data
  const categories = useMemo(() => {
    if (!poliData?.data) return [];
    const cats = Array.from(new Set(poliData.data.map((p: Poli) => p.category)));
    return cats.sort();
  }, [poliData]);

  // Filter client-side dari data yang sudah di-cache
  const filteredPoli = useMemo(() => {
    if (!poliData?.data) return [];

    return poliData.data.filter((poli: Poli) => {
      // Filter by search term
      const matchesSearch = poli.name.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by category
      const matchesCategory = selectedCategory === "all" || poli.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [poliData, searchTerm, selectedCategory]);

  const handlePoliClick = (poliId: string) => {
    navigate(`/poli/${poliId}`);
  };

  return (
    <div className="min-h-screen py-12 px-6" style={{ backgroundColor: "var(--color-bg-base)" }}>
      <div className="max-w-container mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>
            Semua Poli
          </h1>
          <p className="text-base" style={{ color: "var(--color-text-secondary)" }}>
            Pilih poli sesuai kebutuhan kesehatan Anda
          </p>
        </div>

        {/* Search & Filter */}
        {!isLoading && (
          <PoliSearchFilter
            onSearchChange={setSearchTerm}
            onCategoryChange={setSelectedCategory}
            selectedCategory={selectedCategory}
            categories={categories as string[]}
          />
        )}

        {/* Loading State - Skeleton Grid */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} variant="card" height={180} />
            ))}
          </div>
        )}

        {/* Poli Grid with Stagger Animation & Empty State */}
        {!isLoading && (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory + searchTerm}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {filteredPoli.length === 0 ? (
                <EmptyState
                  icon="search"
                  title="Poli Tidak Ditemukan"
                  description={
                    searchTerm
                      ? `Tidak ada poli dengan nama "${searchTerm}"`
                      : selectedCategory !== "all"
                      ? `Tidak ada poli di kategori "${selectedCategory}"`
                      : "Belum ada poli yang tersedia"
                  }
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPoli.map((poli: Poli, index: number) => (
                    <motion.div
                      key={poli.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <PoliCard poli={poli} onClick={() => handlePoliClick(poli.id)} />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}