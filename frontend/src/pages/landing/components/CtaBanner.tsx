import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "../../../shared/components/ui/Button";

const CTA_IMG =
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&q=70&auto=format&fit=crop";

export function CtaBanner() {
  return (
    <section className="px-6 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative max-w-container mx-auto rounded-card overflow-hidden shadow-soft"
      >
        {/* Background photo */}
        <img
          src={CTA_IMG}
          alt=""
          aria-hidden
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/95 via-primary/85 to-primary/55" />

        {/* Content */}
        <div className="relative z-10 px-8 py-14 md:px-14 md:py-20 max-w-2xl space-y-5">
          <h2
            className="text-h1 font-bold text-white leading-tight"
          >
            Siap mendaftar tanpa antre?
          </h2>
          <p className="text-body text-white/85 max-w-md">
            Daftar online sekarang, datang tepat waktu. Cukup bawa NIK Anda dan
            nikmati layanan tanpa menunggu lama.
          </p>
          <Link to="/cek-nik" className="inline-block pt-2">
            <Button variant="accent" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
              Daftar Sekarang
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}