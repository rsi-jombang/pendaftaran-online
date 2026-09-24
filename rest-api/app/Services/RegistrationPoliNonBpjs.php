<?php

namespace App\Services;

use App\Helpers\GeneralHelper;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class RegistrationPoliNonBpjs
{
    public function register($data)
    {
        // Cek batas waktu pendaftaran (smis_rg_jadwal_poli_non_bpjs.waktu_batas_pendaftaran, menit).
        // Tolak jika now >= jam_mulai - batas. NULL/0 = tutup tepat jam mulai.
        // Zona waktu eksplisit Asia/Jakarta (default app = UTC).
        $jadwal = DB::table('smis_rg_jadwal_poli_non_bpjs')->where('id', $data['jadwal_id'])->first();
        if (!$jadwal) {
            return [
                'success' => false,
                'message' => 'Jadwal tidak ditemukan.',
                'data' => null,
                'errors' => ['general' => ['Jadwal tidak ditemukan.']],
            ];
        }
        $batas = (int) ($jadwal->waktu_batas_pendaftaran ?? 0);
        $mulai = Carbon::parse($data['date'] . ' ' . $jadwal->jam_mulai, 'Asia/Jakarta');
        $cutoff = $mulai->copy()->subMinutes($batas);
        if (Carbon::now('Asia/Jakarta')->greaterThanOrEqualTo($cutoff)) {
            $msg = 'Pendaftaran untuk jadwal ini sudah ditutup (batas ' . $batas
                . ' menit sebelum jam ' . substr($jadwal->jam_mulai, 0, 5)
                . '). Silakan pilih jadwal lain.';
            return [
                'success' => false,
                'message' => $msg,
                'data' => null,
                'errors' => ['general' => [$msg]],
            ];
        }

        // Here you would implement the logic to register a patient for a non-BPJS poli
        // For example, you might save the data to the database, send notifications, etc.
        $generate=GeneralHelper::generateAntreanNonBpjs($data['jadwal_id'], $data['kodePoli'], $data['date']);
        $patient = DB::table('smis_rg_patient')->where('ktp', $data['patient_nik'])->first();
        $count_baru_lama = DB::table('smis_rg_layananpasien')->where('nrm', $patient->id)->count();

        $antrian = new \App\Models\AntrianNonBpjs();
        if($count_baru_lama == 0){
            $antrian->pasien_baru = 0;
        } else {
            $antrian->pasien_baru = 1;
        }

        $antrian->kdantrian = $generate['kdantrian'];
        $antrian->tanggalperiksa = $data['date'];
        $antrian->jadwal_id = $data['jadwal_id'];
        $antrian->carabayar = $data['payment_method'];
        $antrian->asuransi = $data['insurance_id'] ?? 0;
        $antrian->perusahaan = $data['company_id'] ?? 0;
        $antrian->nomorantrean = $generate['nomorantrean'];
        $antrian->angkaantrean = $generate['angkaantrean'];
        $antrian->norm = $patient->id;
        $antrian->namapoli = $data['poliName'];
        // $antrian->kodeboking = '';
        $antrian->namadokter = $data['doctorName'];
        $antrian->keterangan = 'Peserta harap 60 menit lebih awal guna pencatatan administrasi.';
        $antrian->namapj = $data['responsible_name'] ?? '';
        $antrian->telppj = $data['responsible_phone'] ?? '';
        $antrian->kedatangan = 'Datang Sendiri';
        $antrian->id_vaksin = $data['id_vaksin'] ?? null;
        $antrian->no_paspor = $data['no_paspor'] ?? '';
        $antrian->save();

        // WA fire-and-forget (tidak gagalkan registrasi)
        try {
            $wa = app(WhatsappService::class);
            $phone = $patient->telpon ?? $data['responsible_phone'] ?? null;
            if ($phone) {
                $wa->send($phone, $wa->buildMessage($data, $antrian->kdantrian, $antrian->nomorantrean));
            }
        } catch (\Throwable $e) {
            // silent
        }

        return [
            'success' => true,
            'message' => 'Pendaftaran berhasil',
            'data' => [
                'registration_id' => $antrian->kdantrian,
                'queue_number' => $antrian->nomorantrean,
                'status' => 'waiting',
                'queue_position' => (int) $antrian->angkaantrean,
                'estimated_wait_minutes' => null,
                'is_bpjs' => false,
                'patient' => [
                    'name' => $patient->nama,
                    'nik_masked' => substr($data['patient_nik'], 0, 2) . str_repeat('x', 10) . substr($data['patient_nik'], -4),
                ],
                'poli' => ['name' => $data['poliName']],
                'doctor' => ['name' => $data['doctorName']],
                'schedule' => [
                    'date' => $data['date'],
                    'practice_hours' => $data['practiceHours'],
                ],
            ],
        ];
    }
}
