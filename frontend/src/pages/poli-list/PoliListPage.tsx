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
  // Category filter removed since API doesn't provide category
  // const [selectedCategory, setSelectedCategory] = useState("all");

  // Filter client-side dari data yang sudah di-cache
  const filteredPoli = useMemo(() => {
    if (!poliData?.data) return [];

    return poliData.data.filter((poli: Poli) => {
      // Filter by search term - use nama_poli
      const matchesSearch = poli.nama_poli?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [poliData, searchTerm]);

  const handlePoliClick = (slugPoli: string) => {
    // Use slug_poli for navigation
    navigate(`/poli/${slugPoli}`);
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

        {/* Search Filter */}
        {!isLoading && (
          <PoliSearchFilter
            onSearchChange={setSearchTerm}
            // onCategoryChange={setSelectedCategory}
            // selectedCategory={selectedCategory}
            // categories={[]}
            // Categories removed since API doesn't provide category
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
              key={searchTerm}
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
                      : "Belum ada poli yang tersedia"
                  }
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPoli.map((poli: Poli, index: number) => (
                    <motion.div
                      key={poli.slug_poli}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <PoliCard poli={poli} onClick={() => handlePoliClick(poli.slug_poli)} />
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