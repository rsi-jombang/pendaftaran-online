<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsappService
{
    public function send(?string $phone, string $message): bool
    {
        if (!config('services.wa.enabled')) {
            return false;
        }
        $to = $this->normalize($phone);
        if (!$to) {
            Log::warning('[WA] nomor kosong, skip', ['phone' => $phone]);
            return false;
        }
        $url = rtrim(config('services.wa.url'), '/') . '/send';
        $key = config('services.wa.key');
        try {
            $res = Http::timeout(5)->withHeaders(
                $key ? ['X-API-KEY' => $key] : []
            )->post($url, ['to' => $to, 'message' => $message]);
            if (!$res->successful()) {
                Log::warning('[WA] gagal', ['to' => $to, 'status' => $res->status(), 'body' => $res->body()]);
                return false;
            }
            return true;
        } catch (\Throwable $e) {
            Log::warning('[WA] exception', ['to' => $to, 'msg' => $e->getMessage()]);
            return false;
        }
    }

    public function buildMessage(array $data, string $kode, string $nomorAntrean): string
    {
        $nama = $data['poliName'] ?? $data['poli_name'] ?? '-';
        $dokter = $data['doctorName'] ?? '-';
        $tgl = $data['date'] ?? '-';
        $jam = $data['practiceHours'] ?? '-';
        return "Halo, pendaftaran Anda berhasil.\n"
            . "Poli: {$nama}\n"
            . "Dokter: {$dokter}\n"
            . "Tanggal: {$tgl} ({$jam})\n"
            . "No Antrian: {$nomorAntrean} (ID: {$kode})\n"
            . "Harap datang 60 menit lebih awal guna pencatatan administrasi.";
    }

    private function normalize(?string $phone): ?string
    {
        if (!$phone) return null;
        $p = preg_replace('/[^0-9]/', '', $phone);
        if (!$p) return null;
        if (str_starts_with($p, '0')) $p = '62' . substr($p, 1);
        if (!str_starts_with($p, '62')) $p = '62' . $p;
        return $p;
    }
}
