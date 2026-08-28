import {
  Baby,
  Heart,
  Eye,
  Stethoscope,
  Droplet,
  Activity,
  Brain,
} from "lucide-react";

interface PoliIconProps {
  namaPoli: string;
  className?: string;
  color?: string;
}

/**
 * Icon khas poli berdasarkan nama poli.
 * Satu sumber kebenaran agar mapping konsisten di seluruh halaman.
 */
export function PoliIcon({
  namaPoli,
  className = "w-6 h-6",
  color = "var(--color-primary)",
}: PoliIconProps) {
  const nama = namaPoli.toLowerCase();
  const style = { color };

  if (nama.includes("anak")) return <Baby className={className} style={style} />;
  if (nama.includes("bedah")) return <Heart className={className} style={style} />;
  if (nama.includes("jantung") || nama.includes("kardiologi"))
    return <Heart className={className} style={style} />;
  if (nama.includes("mata")) return <Eye className={className} style={style} />;
  if (
    nama.includes("orthopedi") ||
    nama.includes("orthopedy") ||
    nama.includes("tulang")
  )
    return <Activity className={className} style={style} />;
  if (nama.includes("paru")) return <Activity className={className} style={style} />;
  if (nama.includes("interne") || nama.includes("penyakit dalam"))
    return <Stethoscope className={className} style={style} />;
  if (nama.includes("syaraf") || nama.includes("saraf") || nama.includes("neurologi"))
    return <Brain className={className} style={style} />;
  if (nama.includes("umum")) return <Stethoscope className={className} style={style} />;
  if (nama.includes("gigi") || nama.includes("dental"))
    return <Heart className={className} style={style} />;
  if (nama.includes("kulit") || nama.includes("dermatologi"))
    return <Droplet className={className} style={style} />;
  if (nama.includes("tht")) return <Activity className={className} style={style} />;
  if (nama.includes("vaksin")) return <Heart className={className} style={style} />;
  if (nama.includes("urologi")) return <Droplet className={className} style={style} />;
  if (nama.includes("bedah") || nama.includes("kandungan") || nama.includes("obgyn"))
    return <Heart className={className} style={style} />;
  if (nama.includes("check up") || nama.includes("medical"))
    return <Activity className={className} style={style} />;

  return <Stethoscope className={className} style={style} />;
}
