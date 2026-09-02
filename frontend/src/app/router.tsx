import { createBrowserRouter } from "react-router-dom";
import { LandingPage } from "../pages/landing/LandingPage";
import { NikCheckPage } from "../pages/nik-check/NikCheckPage";
import { PoliListPage } from "../pages/poli-list/PoliListPage";
import { PoliDetailPage } from "../pages/poli-detail/PoliDetailPage";
import { RegistrationFormPage } from "../pages/registration-form/RegistrationFormPage";
import { RegistrationStatusPage } from "../pages/registration-status/RegistrationStatusPage";

export const router = createBrowserRouter([
  // Publik — tanpa guard
  { path: "/", element: <LandingPage /> },
  { path: "/poli", element: <PoliListPage /> },
  { path: "/poli/:slug", element: <PoliDetailPage /> },

  // Guarded — alur pendaftaran (wizard, berurutan)
  { path: "/cek-nik", element: <NikCheckPage /> },
  { path: "/daftar", element: <RegistrationFormPage /> },
  { path: "/status/:registrationId", element: <RegistrationStatusPage /> },
]);