// Palet gradient — dipilih deterministik dari nama poli
const palettes: Array<[string, string]> = [
  ["#0f9b8e", "#0b7a70"],
  ["#3b82c4", "#2563eb"],
  ["#ff7a59", "#ea580c"],
  ["#22a366", "#15803d"],
];

/**
 * Gradient konsisten per-nama-poli (hash deterministik).
 * Dipakai bersama oleh landing preview, halaman list, dan banner detail.
 */
export function getPoliGradient(namaPoli: string): [string, string] {
  let hash = 0;
  for (const ch of namaPoli) {
    hash = (hash * 31 + ch.charCodeAt(0)) % 997;
  }
  return palettes[hash % palettes.length];
}