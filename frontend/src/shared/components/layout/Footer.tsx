import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="max-w-container mx-auto px-6 lg:px-20 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Info RS */}
          <div>
            <h3 className="text-h3 text-text-primary mb-4">Rumah Sakit</h3>
            <p className="text-body text-text-secondary mb-4">
              Menyediakan layanan kesehatan terbaik dengan teknologi modern untuk kenyamanan pasien.
            </p>
          </div>

          {/* Jam Operasional */}
          <div>
            <h3 className="text-h3 text-text-primary mb-4">Jam Operasional</h3>
            <dl className="space-y-2 text-body text-text-secondary">
              <div className="flex justify-between">
                <dt>Senin - Jumat</dt>
                <dd className="font-medium">07.00 - 21.00</dd>
              </div>
              <div className="flex justify-between">
                <dt>Sabtu</dt>
                <dd className="font-medium">08.00 - 16.00</dd>
              </div>
              <div className="flex justify-between">
                <dt>Minggu & Libur</dt>
                <dd className="font-medium">Tutup</dd>
              </div>
            </dl>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="text-h3 text-text-primary mb-4">Kontak</h3>
            <address className="text-body text-text-secondary not-italic space-y-2">
              <p>Jl. Kesehatan No. 123, Kota Medis</p>
              <p>Telp: (021) 1234-5678</p>
              <p>Email: info@rumahsakit.co.id</p>
            </address>
          </div>

          {/* Link Cepat */}
          <div>
            <h3 className="text-h3 text-text-primary mb-4">Link Cepat</h3>
            <nav className="space-y-2">
              <Link
                to="/"
                className="block text-body text-text-secondary hover:text-primary transition-colors"
              >
                Beranda
              </Link>
              <Link
                to="/#layanan"
                className="block text-body text-text-secondary hover:text-primary transition-colors"
              >
                Layanan Poli
              </Link>
              <Link
                to="/cek-nik"
                className="block text-body text-text-secondary hover:text-primary transition-colors"
              >
                Cek Status Pendaftaran
              </Link>
              <Link
                to="/#kontak"
                className="block text-body text-text-secondary hover:text-primary transition-colors"
              >
                Kontak Kami
              </Link>
            </nav>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-small text-text-secondary">
            &copy; 2026 Rumah Sakit. Hak cipta dilindungi.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-text-secondary hover:text-primary transition-colors"
              aria-label="Facebook"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a
              href="#"
              className="text-text-secondary hover:text-primary transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
              </svg>
            </a>
            <a
              href="#"
              className="text-text-secondary hover:text-primary transition-colors"
              aria-label="Twitter"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
              </svg>
            </a>
            <a
              href="#"
              className="text-text-secondary hover:text-primary transition-colors"
              aria-label="YouTube"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}