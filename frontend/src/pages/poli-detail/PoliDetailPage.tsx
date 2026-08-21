import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronLeft, Baby, Heart, Eye, Stethoscope, Droplet, Activity } from "lucide-react";
import { Button, Skeleton } from "../../shared/components/ui";
import { DateChipSelector } from "./components/DateChipSelector";
import { DoctorCard } from "./components/DoctorCard";
import { usePoliDetail, useDoctorSchedule } from "../../features/poli";
import { useRegistrationFlowStore } from "../../shared/store/registrationFlowStore";
import type { Doctor } from "../../features/schedule/types";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export function PoliDetailPage() {
  const navigate = useNavigate();
  const { poliId } = useParams<{ poliId: string }>();
  const { setPendingSelection } = useRegistrationFlowStore();

  const poliIdParam = poliId ?? null;

  // Fetch poli detail dari API menggunakan poliId dari URL
  const { data: poliData, isLoading: isPoliLoading } = usePoliDetail(poliIdParam);

  // Date state - default hari ini
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  // Fetch jadwal dokter berdasarkan tanggal
  const { data: scheduleData, isLoading } = useDoctorSchedule(poliIdParam, formatDate(selectedDate));

  const handleDoctorSelect = (doctor: Doctor) => {
    if (doctor.quota_status === "available") {
      const poli = poliData?.data;
      if (poli) {
        setPendingSelection({
          poliId: poli.id,
          poliName: poli.name,
          doctorId: doctor.id,
          doctorName: doctor.name,
          date: formatDate(selectedDate),
          practiceHours: doctor.practice_hours,
        });
        navigate("/cek-nik");
      }
    }
  };

  // Loading poli detail
  if (isPoliLoading) {
    return (
      <div className="min-h-screen py-12 px-6" style={{ backgroundColor: "var(--color-bg-base)" }}>
        <div className="max-w-container mx-auto">
          <div className="space-y-6">
            <Skeleton variant="card" height={200} />
            <Skeleton variant="card" height={150} />
          </div>
        </div>
      </div>
    );
  }

  const poli = poliData?.data;
  if (!poli) {
    return (
      <div className="min-h-screen py-12 px-6" style={{ backgroundColor: "var(--color-bg-base)" }}>
        <div className="max-w-container mx-auto text-center py-12">
          <p style={{ color: "var(--color-text-secondary)" }}>Poli tidak ditemukan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6" style={{ backgroundColor: "var(--color-bg-base)" }}>
      <div className="max-w-container mx-auto">
        {/* Header Detail Poli */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
              <Link to="/" className="hover:underline">Beranda</Link>
              <span>/</span>
              <Link to="/poli" className="hover:underline">Semua Poli</Link>
              <span>/</span>
              <span className="font-medium" style={{ color: "var(--color-text-primary)" }}>{poli.name}</span>
            </nav>

            {/* Kembali ke Semua Poli Button */}
            <Link to="/poli">
              <Button variant="ghost" size="sm" icon={<ChevronLeft className="w-4 h-4" />}>
                Kembali ke Semua Poli
              </Button>
            </Link>
          </div>

          {/* Poli Title + Icon */}
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-card flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "var(--color-primary-light)" }}
            >
              {getPoliIcon(poli.icon)}
            </div>
            <div>
              <h1 className="text-3xl font-bold" style={{ color: "var(--color-text-primary)" }}>
                {poli.name}
              </h1>
              {poli.description && (
                <p className="text-sm mt-2" style={{ color: "var(--color-text-secondary)" }}>
                  {poli.description}
                </p>
              )}
              <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
                {poli.doctors_today} dokter tersedia hari ini · {poli.quota_remaining} kuota tersisa
              </p>
            </div>
          </div>
        </motion.div>

        {/* Date Chip Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
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
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-8"
        >
          <h3 className="text-xl font-semibold mb-4" style={{ color: "var(--color-text-primary)" }}>
            Jadwal Dokter
          </h3>

          {isLoading ? (
            // Skeleton loading
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} variant="card" height={120} />
              ))}
            </div>
          ) : scheduleData?.data ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedDate.toISOString()}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-sm mb-4" style={{ color: "var(--color-text-secondary)" }}>
                  Tanggal terpilih: {format(selectedDate, "EEEE, d MMMM yyyy", { locale: id })}
                </p>
                <div className="space-y-4">
                  {scheduleData.data.doctors.map((doctor: Doctor) => (
                    <DoctorCard
                      key={doctor.id}
                      doctor={doctor}
                      onDaftar={() => handleDoctorSelect(doctor)}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="text-center py-12">
              <p style={{ color: "var(--color-text-secondary)" }}>
                Tidak ada jadwal dokter untuk tanggal ini
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// Helper format date untuk API
function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function getPoliIcon(iconName: string): React.ReactNode {
  const icons: Record<string, React.ReactNode> = {
    baby: <Baby className="w-8 h-8" style={{ color: "var(--color-primary)" }} />,
    heart: <Heart className="w-8 h-8" style={{ color: "var(--color-primary)" }} />,
    eye: <Eye className="w-8 h-8" style={{ color: "var(--color-primary)" }} />,
    stethoscope: <Stethoscope className="w-8 h-8" style={{ color: "var(--color-primary)" }} />,
    tooth: <Activity className="w-8 h-8" style={{ color: "var(--color-primary)" }} />,
    droplet: <Droplet className="w-8 h-8" style={{ color: "var(--color-primary)" }} />,
  };
  return icons[iconName] || <Stethoscope className="w-8 h-8" style={{ color: "var(--color-primary)" }} />;
}