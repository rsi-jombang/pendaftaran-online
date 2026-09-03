<?php

namespace App\Services;

use App\Helpers\GeneralHelper;
use Illuminate\Support\Facades\DB;

class RegistrationPoliNonBpjs
{
    public function register($data)
    {
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
        $antrian->save();

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
