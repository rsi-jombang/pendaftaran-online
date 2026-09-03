<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class QueueStatusController extends Controller
{
    public function show($kdantrian)
    {
        $antrian = DB::table('antrians_non_bpjs')
            ->where('kdantrian', $kdantrian)
            ->first();

        if (!$antrian) {
            return response()->json([
                'success' => false,
                'message' => 'Data antrian tidak ditemukan',
            ], 404);
        }

        $queuePosition = DB::table('antrians_non_bpjs')
            ->where('jadwal_id', $antrian->jadwal_id)
            ->whereDate('tanggalperiksa', $antrian->tanggalperiksa)
            ->where('angkaantrean', '<', $antrian->angkaantrean)
            ->count();

        $patient = DB::table('smis_rg_patient')
            ->where('id', $antrian->norm)
            ->first();

        $nikMasked = '';
        if ($patient && $patient->ktp) {
            $nik = $patient->ktp;
            $nikMasked = substr($nik, 0, 2) . str_repeat('x', 10) . substr($nik, -4);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'registration_id' => $antrian->kdantrian,
                'queue_number' => $antrian->nomorantrean,
                'status' => 'waiting',
                'queue_position' => $queuePosition,
                'estimated_wait_minutes' => null,
                'is_bpjs' => false,
                'patient' => [
                    'name' => $patient->nama ?? '',
                    'nik_masked' => $nikMasked,
                ],
                'poli' => ['name' => $antrian->namapoli],
                'doctor' => ['name' => $antrian->namadokter],
                'schedule' => [
                    'date' => $antrian->tanggalperiksa,
                    'practice_hours' => '',
                ],
            ],
        ]);
    }
}
