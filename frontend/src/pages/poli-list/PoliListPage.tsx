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

  // Filter client-side dari data yang sudah di-cache
  const filteredPoli = useMemo(() => {
    if (!poliData?.data) return [];

    return poliData.data.filter((poli: Poli) => {
      const matchesSearch = poli.nama_poli?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [poliData, searchTerm]);

  const handlePoliClick = (slugPoli: string) => {
    navigate(`/poli/${slugPoli}`);
  };

  return (
    <div className="relative min-h-screen">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="blob w-[380px] h-[380px] -top-28 -right-28"
          style={{ backgroundColor: "var(--c-primary-soft)", opacity: 0.7 }}
        />
        <div
          className="blob w-[320px] h-[320px] top-48 -left-36"
          style={{
            background:
              "color-mix(in srgb, var(--color-secondary) 14%, transparent)",
          }}
        />
      </div>

      <div className="relative py-12 px-6">
        <div className="max-w-container mx-auto">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="text-center mb-10"
          >
            <h1
              className="text-h1 font-bold mb-2"
              style={{ color: "var(--c-text)" }}
            >
              Semua Poli
            </h1>
            <p className="text-body text-text-secondary">
              Pilih poli sesuai kebutuhan kesehatan Anda
            </p>
          </motion.div>

          {/* Search Filter */}
          {!isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="max-w-xl mx-auto mb-4"
            >
              <PoliSearchFilter onSearchChange={setSearchTerm} />
            </motion.div>
          )}

          {/* Result count */}
          {!isLoading && poliData?.data && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center text-small text-text-secondary mb-8"
            >
              Menampilkan{" "}
              <span className="font-semibold text-primary">{filteredPoli.length}</span>{" "}
              poli
            </motion.p>
          )}

          {/* Loading State - Skeleton Grid */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} variant="card" height={230} />
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
                        transition={{
                          duration: 0.3,
                          delay: index * 0.05,
                          ease: "easeOut",
                        }}
                      >
                        <PoliCard
                          poli={poli}
                          onClick={() => handlePoliClick(poli.slug_poli)}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
          </div>
      </div>
    </div>
  );
}