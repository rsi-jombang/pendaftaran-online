<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\RegistrationPoliBpjs;
use App\Services\RegistrationPoliNonBpjs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RegistrationController extends Controller
{
    public function store(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'patient_id' => 'required|integer',
            'patient_nik' => 'required|string',
            'poli_id' => 'required|string',
            'jadwal_id' => 'required|integer',
            'doctor_id' => 'required|string',
            'doctorName' => 'required|string',
            'poliName' => 'required|string',
            'kodePoli' => 'required|string',
            'practiceHours' => 'required|string',
            'date' => 'required|date_format:Y-m-d',
            'payment_method' => 'required|in:umum,asuransi,rekanan',
            'insurance_id' => 'nullable|string',
            'company_id' => 'nullable|string',
            'responsible_name' => 'nullable|string',
            'responsible_phone' => 'nullable|string',
        ]);

        $cekJenisPoliNonBpjs = DB::table('smis_rg_jadwal_poli_non_bpjs')->find($validatedData['jadwal_id']);

        if (!$cekJenisPoliNonBpjs) {
            $regBpjs = new RegistrationPoliBpjs();
            return response()->json([
                'success' => false,
                'message' => 'Invalid schedule ID',
            ], 422);
        }

        $regNonBpjs = new RegistrationPoliNonBpjs();
        $result = $regNonBpjs->register($validatedData);

        return response()->json($result, 201);
    }
}
