import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  Users,
  Clock,
} from "lucide-react";
import { Skeleton } from "../../shared/components/ui";
import { PoliIcon } from "../../shared/components/ui/PoliIcon";
import { EmptyState } from "../../shared/components/feedback";
import { DateChipSelector } from "./components/DateChipSelector";
import { DoctorCard } from "./components/DoctorCard";
import { usePoliDetail, useDoctorSchedule } from "../../features/poli";
import { useRegistrationFlowStore } from "../../shared/store/registrationFlowStore";
import type { Doctor } from "../../features/schedule/types";
import { getPoliGradient } from "../../shared/utils/poliGradient";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export function PoliDetailPage() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const slugValue = slug ?? null;
  const { setPendingSelection } = useRegistrationFlowStore();

  // Fetch poli detail dari API menggunakan slug dari URL
  const { data: poliData, isLoading: isPoliLoading } = usePoliDetail(slugValue);

  // Date state - default hari ini
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  // Fetch jadwal dokter berdasarkan tanggal
  const { data: scheduleData, isLoading } = useDoctorSchedule(
    slugValue,
    formatDate(selectedDate)
  );

  const handleDoctorSelect = (doctor: Doctor) => {
    const poli = poliData?.data;
    if (poli) {
      setPendingSelection({
        poliId: poli.slug_poli,
        poliName: poli.nama_poli,
        kodePoli: poli.kode_poli ?? "",
        jadwalId: doctor.jadwal_id,
        doctorId: doctor.id,
        doctorName: doctor.name,
        date: formatDate(selectedDate),
        practiceHours: doctor.practice_hours,
      });
      const hasPatient = !!useRegistrationFlowStore.getState().patient;
      navigate(hasPatient ? "/daftar" : "/cek-nik");
    }
  };

  // Loading poli detail
  if (isPoliLoading) {
    return (
      <div
        className="min-h-screen px-6 py-12"
        style={{ backgroundColor: "var(--c-bg)" }}
      >
        <div className="mx-auto max-w-container">
          <div className="space-y-6">
            <Skeleton variant="card" height={220} />
            <Skeleton variant="card" height={150} />
          </div>
        </div>
      </div>
    );
  }

  const poli = poliData?.data;
  if (!poli) {
    return (
      <div
        className="min-h-screen px-6 py-12"
        style={{ backgroundColor: "var(--c-bg)" }}
      >
        <div className="max-w-container mx-auto py-12 text-center">
          <p style={{ color: "var(--c-text-muted)" }}>Poli tidak ditemukan</p>
        </div>
      </div>
    );
  }

  const [gradFrom, gradTo] = getPoliGradient(poli.nama_poli);
  const doctors = scheduleData?.data.doctors ?? [];

  const pill = "px-3 py-1.5 rounded-full text-small transition-colors";

  return (
    <div
      className="min-h-screen px-6 py-12"
      style={{ backgroundColor: "var(--c-bg)" }}
    >
      <div className="mx-auto max-w-container">
        {/* ============================================================
            Banner Detail Poli (gradient penuh)
           ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative mb-10 overflow-hidden rounded-card"
          style={{ background: `linear-gradient(135deg, ${gradFrom}, ${gradTo})` }}
        >
          {/* Decorative circles */}
          <div
            className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}
          />
          <div
            className="pointer-events-none absolute -bottom-24 right-40 h-52 w-52 rounded-full"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.06)" }}
          />

          <div className="relative p-6 md:p-8">
            {/* Top row: breadcrumb pills + tombol kembali */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
              <nav className="flex flex-wrap items-center gap-1.5 text-small">
                <Link
                  to="/"
                  className={`${pill} bg-white/15 text-white/90 hover:bg-white/25`}
                >
                  Beranda
                </Link>
                <span className="text-white/50">/</span>
                <Link
                  to="/poli"
                  className={`${pill} bg-white/15 text-white/90 hover:bg-white/25`}
                >
                  Semua Poli
                </Link>
                <span className="text-white/50">/</span>
                <span className={`${pill} bg-white/25 font-medium text-white`}>
                  {poli.nama_poli}
                </span>
              </nav>

              <Link
                to="/poli"
                className={`${pill} inline-flex items-center gap-1 bg-white/15 text-white hover:bg-white/25`}
              >
                <ChevronLeft className="h-4 w-4" />
                Kembali
              </Link>
            </div>

            {/* Title row */}
            <div className="flex items-center gap-5">
              <div
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-card"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.18)",
                  backdropFilter: "blur(4px)",
                }}
              >
                <PoliIcon namaPoli={poli.nama_poli} className="w-10 h-10" color="#ffffff" />
              </div>
              <div>
                <h1 className="text-h1 font-bold text-white">{poli.nama_poli}</h1>
                {poli.description && (
                  <p className="mt-1 max-w-xl text-small text-white/85 md:text-body">
                    {poli.description}
                  </p>
                )}
              </div>
            </div>

            {/* Meta chips */}
            <div className="relative mt-6 flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-small text-white/95 backdrop-blur-sm" style={{ backgroundColor: "rgba(255, 255, 255, 0.18)" }}>
                <Users className="h-4 w-4" />
                {poli.jumlah_dokter} dokter
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-small text-white/95 backdrop-blur-sm" style={{ backgroundColor: "rgba(255, 255, 255, 0.18)" }}>
                <Clock className="h-4 w-4" />
                {poli.jam_praktek}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Date Chip Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1, ease: "easeOut" }}
        >
          <DateChipSelector
            selectedDate={selectedDate}
            onDateChange={(date) => setSelectedDate(date)}
          />
        </motion.div>

        {/* Doctors List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2, ease: "easeOut" }}
          className="mt-8"
        >
          <h3
            className="text-h2 font-semibold mb-5"
            style={{ color: "var(--c-text)" }}
          >
            Jadwal Dokter
          </h3>

          {isLoading ? (
            // Skeleton loading
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} variant="card" height={120} />
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedDate.toISOString()}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <p className="mb-4 text-sm" style={{ color: "var(--c-text-muted)" }}>
                  Tanggal terpilih:{" "}
                  {format(selectedDate, "EEEE, d MMMM yyyy", { locale: id })}
                </p>

                {doctors.length === 0 ? (
                  <EmptyState
                    icon="inbox"
                    title="Belum Ada Jadwal"
                    description="Tidak ada jadwal dokter pada tanggal ini. Silakan pilih tanggal lain."
                    className="py-8"
                  />
                ) : (
                  <div className="space-y-4">
                    {doctors.map((doctor: Doctor) => (
                      <DoctorCard
                        key={doctor.id}
                        doctor={doctor}
                        onDaftar={() => handleDoctorSelect(doctor)}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// Helper format date untuk API — pakai waktu lokal, BUKAN UTC
function formatDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}