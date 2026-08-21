import { createBrowserRouter } from "react-router-dom";
import { LandingPage } from "../pages/landing/LandingPage";
import { NikCheckPage } from "../pages/nik-check/NikCheckPage";
import { PoliListPage } from "../pages/poli-list/PoliListPage";
import { PoliDetailPage } from "../pages/poli-detail/PoliDetailPage";
import { RegistrationStatusPage } from "../pages/registration-status/RegistrationStatusPage";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/cek-nik", element: <NikCheckPage /> },
  { path: "/poli", element: <PoliListPage /> },
  { path: "/poli/:poliId", element: <PoliDetailPage /> },
  { path: "/status/:registrationId", element: <RegistrationStatusPage /> },
]);