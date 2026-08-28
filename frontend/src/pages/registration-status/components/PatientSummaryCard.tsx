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
    <Card variant="default" className="overflow-hidden p-0">
      {/* Card header */}
      <div className="border-b px-6 py-4" style={{ borderColor: "var(--c-border)" }}>
        <h3 className="text-body font-semibold" style={{ color: "var(--c-text)" }}>
          Detail Pendaftaran
        </h3>
      </div>

      <div className="space-y-3 p-6">
        {/* Patient Name */}
        <div
          className="flex items-center gap-4 rounded-input p-4"
          style={{ backgroundColor: "var(--c-bg)" }}
        >
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: "var(--c-primary-soft)" }}
          >
            <User className="h-5 w-5" style={{ color: "var(--c-primary)" }} />
          </div>
          <div className="min-w-0">
            <p className="text-xs" style={{ color: "var(--c-text-muted)" }}>
              Nama Pasien
            </p>
            <p className="truncate text-body font-semibold" style={{ color: "var(--c-text)" }}>
              {data.patient.name}
            </p>
          </div>
        </div>

        {/* NIK Masked */}
        <div
          className="flex items-center gap-4 rounded-input p-4"
          style={{ backgroundColor: "var(--c-bg)" }}
        >
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: "var(--c-primary-soft)" }}
          >
            <Calendar className="h-5 w-5" style={{ color: "var(--c-primary)" }} />
          </div>
          <div className="min-w-0">
            <p className="text-xs" style={{ color: "var(--c-text-muted)" }}>
              NIK
            </p>
            <p
              className="text-body font-mono"
              style={{ color: "var(--c-text)", fontFamily: "'Space Grotesk', monospace" }}
            >
              {data.patient.nik_masked}
            </p>
          </div>
        </div>

        {/* Poli */}
        <div
          className="flex items-center gap-4 rounded-input p-4"
          style={{ backgroundColor: "var(--c-bg)" }}
        >
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: "var(--c-primary-soft)" }}
          >
            <Stethoscope className="h-5 w-5" style={{ color: "var(--c-primary)" }} />
          </div>
          <div className="min-w-0">
            <p className="text-xs" style={{ color: "var(--c-text-muted)" }}>
              Poli
            </p>
            <p className="truncate text-body font-semibold" style={{ color: "var(--c-text)" }}>
              {data.poli.name}
            </p>
          </div>
        </div>

        {/* Doctor */}
        <div
          className="flex items-center gap-4 rounded-input p-4"
          style={{ backgroundColor: "var(--c-bg)" }}
        >
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: "var(--c-primary-soft)" }}
          >
            <User className="h-5 w-5" style={{ color: "var(--c-primary)" }} />
          </div>
          <div className="min-w-0">
            <p className="text-xs" style={{ color: "var(--c-text-muted)" }}>
              Dokter
            </p>
            <p className="truncate text-body font-semibold" style={{ color: "var(--c-text)" }}>
              {data.doctor.name}
            </p>
          </div>
        </div>

        {/* Schedule & Queue Info */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div
            className="flex items-center gap-3 rounded-input p-4"
            style={{ backgroundColor: "var(--c-bg)" }}
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: "var(--c-primary-soft)" }}
            >
              <Calendar className="h-4 w-4" style={{ color: "var(--c-primary)" }} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px]" style={{ color: "var(--c-text-muted)" }}>
                Tanggal & Jam
              </p>
              <p className="text-small font-medium" style={{ color: "var(--c-text)" }}>
                {formatDate(data.schedule.date)}
              </p>
              <p className="text-[11px]" style={{ color: "var(--c-text-muted)" }}>
                {data.schedule.practice_hours}
              </p>
            </div>
          </div>

          <div
            className="flex items-center gap-3 rounded-input p-4"
            style={{ backgroundColor: "var(--c-bg)" }}
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
              style={{
                backgroundColor: "color-mix(in srgb, var(--c-warning) 15%, transparent)",
              }}
            >
              <Users className="h-4 w-4" style={{ color: "var(--c-warning)" }} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px]" style={{ color: "var(--c-text-muted)" }}>
                Antrian di Depan
              </p>
              <p
                className="text-xl font-bold"
                style={{
                  color: "var(--c-warning)",
                  fontFamily: "'Space Grotesk', monospace",
                }}
              >
                {data.queue_position}
              </p>
            </div>
          </div>
        </div>

        {/* Estimated Wait Time */}
        {data.estimated_wait_minutes > 0 && data.status === "waiting" && (
          <div
            className="flex items-center gap-3 rounded-input p-4"
            style={{
              backgroundColor: "color-mix(in srgb, var(--c-warning) 8%, transparent)",
              border: "1px solid color-mix(in srgb, var(--c-warning) 18%, transparent)",
            }}
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
              style={{
                backgroundColor: "color-mix(in srgb, var(--c-warning) 15%, transparent)",
              }}
            >
              <Clock className="h-4 w-4" style={{ color: "var(--c-warning)" }} />
            </div>
            <div>
              <p className="text-[11px] font-medium" style={{ color: "var(--c-warning)" }}>
                Estimasi Waktu Tunggu
              </p>
              <p
                className="text-xl font-bold"
                style={{
                  color: "var(--c-warning)",
                  fontFamily: "'Space Grotesk', monospace",
                }}
              >
                {data.estimated_wait_minutes} menit
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}