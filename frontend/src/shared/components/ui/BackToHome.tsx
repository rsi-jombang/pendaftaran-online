import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export function BackToHome({
  className = "",
}: {
  className?: string;
}) {
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-1 text-body text-text-secondary hover:text-primary transition-colors ${className}`}
    >
      <ChevronLeft className="h-4 w-4" />
      Kembali ke Beranda
    </Link>
  );
}