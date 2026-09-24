// pickOfDay — pilih satu item dari list secara deterministik per tanggal.
// Stabil selama sehari penuh (tidak berubah tiap render/refresh),
// otomatis berganti keesokan harinya. Dipakai untuk "dokter/poli hari ini".

function hashDate(dateStr: string): number {
  let h = 0;
  for (let i = 0; i < dateStr.length; i++) {
    h = (Math.imul(h, 31) + dateStr.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function pickOfDay<T>(list: readonly T[], dateStr: string): T | null {
  if (list.length === 0) return null;
  return list[hashDate(dateStr) % list.length];
}

// Tanggal lokal YYYY-MM-DD (bukan UTC — hindari geser hari di batas tengah malam).
export function todayLocalStr(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
