import type { RegistrationStatus } from "../../../features/queue/types";

interface PrintReceiptProps {
  data: RegistrationStatus;
}

const STATUS_LABEL: Record<RegistrationStatus["status"], string> = {
  waiting: "Menunggu Panggilan",
  in_service: "Sedang Dilayani",
  done: "Selesai",
};

function formatDateLong(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatPrintedAt(now: Date = new Date()): string {
  return now.toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Struk khusus cetak: hanya tampil di @media print (lihat .print-only di globals.css).
// Seluruh styling inline agar kebal dari cascade layer & theme (termasuk dark mode).
export function PrintReceipt({ data }: PrintReceiptProps) {
  const rows: Array<[string, string]> = [
    ["No. Pendaftaran", data.registration_id],
    ["Nama Pasien", data.patient.name],
    ["NIK", data.patient.nik_masked],
    ["Poli", data.poli.name],
    ["Dokter", data.doctor.name],
    ["Tanggal", formatDateLong(data.schedule.date)],
    ["Jam Praktik", data.schedule.practice_hours || "-"],
    ["Status", STATUS_LABEL[data.status]],
  ];

  return (
    <div className="print-only" style={{ display: "none", color: "#000" }}>
      <div style={{ maxWidth: "160mm", margin: "0 auto", fontFamily: "Arial, Helvetica, sans-serif" }}>
        {/* Kop */}
        <div style={{ textAlign: "center", marginBottom: "6mm" }}>
          <div style={{ fontSize: "15pt", fontWeight: 700, letterSpacing: "0.5pt" }}>
            RUMAH SAKIT ISLAM JOMBANG
          </div>
          <div style={{ fontSize: "11pt", letterSpacing: "2pt", marginTop: "2mm" }}>
            BUKTI PENDAFTARAN POLI ONLINE
          </div>
        </div>

        <div style={{ borderTop: "2px solid #000", marginBottom: "6mm" }} />

        {/* Nomor antrian */}
        <div style={{ textAlign: "center", marginBottom: "6mm" }}>
          <div style={{ fontSize: "9pt", letterSpacing: "2pt", color: "#444" }}>NOMOR ANTRIAN</div>
          <div
            style={{
              display: "inline-block",
              fontSize: "38pt",
              fontWeight: 700,
              fontFamily: "'Courier New', Courier, monospace",
              border: "2px solid #000",
              borderRadius: "4mm",
              padding: "2mm 8mm",
              marginTop: "2mm",
            }}
          >
            {data.queue_number}
          </div>
        </div>

        {/* Rincian */}
        <table style={{ width: "100%", fontSize: "10.5pt", borderCollapse: "collapse" }}>
          <tbody>
            {rows.map(([label, value]) => (
              <tr key={label} style={{ borderBottom: "1px solid #bbb" }}>
                <td style={{ padding: "2mm 0", width: "38%", color: "#333" }}>{label}</td>
                <td style={{ padding: "2mm 0", fontWeight: 700, wordBreak: "break-word" }}>
                  {value || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Catatan kaki */}
        <div style={{ marginTop: "6mm", textAlign: "center", fontSize: "9pt" }}>
          <div style={{ fontStyle: "italic" }}>
            Harap datang 60 menit lebih awal guna pencatatan administrasi.
          </div>
          <div style={{ marginTop: "2mm", color: "#555" }}>
            Dicetak pada: {formatPrintedAt()} WIB
          </div>
        </div>
      </div>
    </div>
  );
}
