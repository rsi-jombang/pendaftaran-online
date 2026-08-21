import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import { motion } from "framer-motion";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-surface/95 backdrop-blur-md shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-container mx-auto px-6 lg:px-20">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-h3">RS</span>
            </div>
            <span className="text-h3 text-text-primary font-semibold hidden sm:block">
              Rumah Sakit
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-body text-text-secondary hover:text-primary transition-colors"
            >
              Beranda
            </Link>
            <Link
              to="/#layanan"
              className="text-body text-text-secondary hover:text-primary transition-colors"
            >
              Layanan
            </Link>
            <Link
              to="/#jadwal"
              className="text-body text-text-secondary hover:text-primary transition-colors"
            >
              Jadwal Dokter
            </Link>
            <Link
              to="/#kontak"
              className="text-body text-text-secondary hover:text-primary transition-colors"
            >
              Kontak
            </Link>
          </div>

          {/* CTA Button */}
          <Link to="/cek-nik">
            <Button variant="accent" size="md">
              Daftar Poli Sekarang
            </Button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
