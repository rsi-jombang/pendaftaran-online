import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "../ui/Button";
import { ThemeToggle } from "./ThemeToggle";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { label: "Beranda", to: "/" },
  { label: "Layanan", to: "/#layanan" },
  { label: "Jadwal Dokter", to: "/poli" },
  { label: "Kontak", to: "/#kontak" },
];

const linkBase =
  "relative text-body text-text-secondary hover:text-primary transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-primary after:transition-all after:duration-200";

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
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-soft">
              <span className="text-white font-bold text-h3">RS</span>
            </div>
            <span className="text-h3 text-text-primary font-semibold hidden sm:block">
              Rumah Sakit
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) =>
              item.to === "/" ? (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? "text-primary after:w-full" : "after:w-0"}`
                  }
                >
                  {item.label}
                </NavLink>
              ) : (
                <Link key={item.label} to={item.to} className={`${linkBase} after:w-0`}>
                  {item.label}
                </Link>
              )
            )}
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* CTA Button */}
            <Link to="/cek-nik">
              <Button variant="accent" size="md">
                Daftar Poli Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
