import { Card } from "../../../shared/components/ui/Card";
import { User, Calendar, Stethoscope, Clock, Users } from "lucide-react";
import type { RegistrationStatus } from "../../../features/queue/types";

interface PatientSummaryCardProps {
  data: RegistrationStatus;
}

export function PatientSummaryCard({ data }: PatientSummaryCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Card variant="default" className="p-6">
      <h3 className="text-lg font-semibold mb-6" style={{ color: "var(--color-text-primary)" }}>
        Detail Pendaftaran
      </h3>

      <div className="space-y-4">
        {/* Patient Name */}
        <div className="flex items-center gap-4 p-4 rounded-input" style={{ backgroundColor: "var(--color-bg-base)" }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "var(--color-primary-light)" }}>
            <User className="w-6 h-6" style={{ color: "var(--color-primary)" }} />
          </div>
          <div>
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>Nama Pasien</p>
            <p className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>{data.patient.name}</p>
          </div>
        </div>

        {/* NIK Masked */}
        <div className="flex items-center gap-4 p-4 rounded-input" style={{ backgroundColor: "var(--color-bg-base)" }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "var(--color-primary-light)" }}>
            <Calendar className="w-6 h-6" style={{ color: "var(--color-primary)" }} />
          </div>
          <div>
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>NIK</p>
            <p className="text-lg font-mono" style={{ color: "var(--color-text-primary)", fontFamily: "'Space Grotesk', monospace" }}>
              {data.patient.nik_masked}
            </p>
          </div>
        </div>

        {/* Poli */}
        <div className="flex items-center gap-4 p-4 rounded-input" style={{ backgroundColor: "var(--color-bg-base)" }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "var(--color-primary-light)" }}>
            <Stethoscope className="w-6 h-6" style={{ color: "var(--color-primary)" }} />
          </div>
          <div>
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>Poli</p>
            <p className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>{data.poli.name}</p>
          </div>
        </div>

        {/* Doctor */}
        <div className="flex items-center gap-4 p-4 rounded-input" style={{ backgroundColor: "var(--color-bg-base)" }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "var(--color-primary-light)" }}>
            <User className="w-6 h-6" style={{ color: "var(--color-primary)" }} />
          </div>
          <div>
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>Dokter</p>
            <p className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>{data.doctor.name}</p>
          </div>
        </div>

        {/* Schedule & Queue Info */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="flex items-center gap-3 p-4 rounded-input" style={{ backgroundColor: "var(--color-bg-base)" }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--color-primary-light)" }}>
              <Calendar className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>Tanggal & Jam</p>
              <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                {formatDate(data.schedule.date)}
              </p>
              <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                {data.schedule.practice_hours}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-input" style={{ backgroundColor: "var(--color-bg-base)" }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--color-warning/20)" }}>
              <Users className="w-5 h-5" style={{ color: "var(--color-warning)" }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>Antrian di Depan</p>
              <p className="text-2xl font-bold" style={{ color: "var(--color-warning)", fontFamily: "'Space Grotesk', monospace" }}>
                {data.queue_position}
              </p>
            </div>
          </div>
        </div>

        {/* Estimated Wait Time */}
        {data.estimated_wait_minutes > 0 && data.status === "waiting" && (
          <div className="flex items-center gap-3 p-4 rounded-input" style={{ backgroundColor: "rgba(245, 166, 35, 0.1)", border: "1px solid rgba(245, 166, 35, 0.2)" }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(245, 166, 35, 0.2)" }}>
              <Clock className="w-5 h-5" style={{ color: "var(--color-warning)" }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: "var(--color-warning)" }}>Estimasi Waktu Tunggu</p>
              <p className="text-xl font-bold" style={{ color: "var(--color-warning)", fontFamily: "'Space Grotesk', monospace" }}>
                {data.estimated_wait_minutes} menit
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}