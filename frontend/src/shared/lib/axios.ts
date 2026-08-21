import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  headers: { Accept: "application/json" },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  // Sisipkan token jika ada sesi/auth (untuk staff di masa depan)
  // Alur publik pasien tidak butuh token
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    // Normalisasi error Laravel (422 validation, 404, 500)
    const normalizedError = {
      message: error.response?.data?.message || "Terjadi kesalahan",
      errors: error.response?.data?.errors || {},
      status: error.response?.status || 500,
    };
    return Promise.reject(normalizedError);
  }
);
