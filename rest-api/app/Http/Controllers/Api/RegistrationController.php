<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\RegistrationPoliBpjs;
use App\Services\RegistrationPoliNonBpjs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

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
            'doctor_id' => 'required|integer',
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
            'id_vaksin' => [
                Rule::requiredIf(fn () => $request->input('poli_id') === 'poli_vaksin'),
                'nullable',
                'string',
                'exists:smis_mjm_tarif_umum,id',
            ],
        ], [
            'id_vaksin.required' => 'Jenis vaksin wajib dipilih untuk Poli Vaksin.',
        ]);

        $cekJenisPoliNonBpjs = DB::table('smis_rg_jadwal_poli_non_bpjs')->where('slug_poli',$validatedData['poli_id'])->first();

        if (!$cekJenisPoliNonBpjs) {
            $regBpjs = new RegistrationPoliBpjs($validatedData);
            $result = $regBpjs->register($validatedData);
            // Opsi A: inline error — kembalikan 422 agar axios masuk catch
            if (($result['success'] ?? null) === false || ($result['status'] ?? null) === false) {
                return response()->json([
                    'success' => false,
                    'message' => $result['message'] ?? 'Validasi gagal',
                    'errors' => $result['errors'] ?? ['general' => [$result['message'] ?? 'Validasi gagal']],
                ], 422);
            }
            return response()->json($result, 201);
        }

        $regNonBpjs = new RegistrationPoliNonBpjs();
        $result = $regNonBpjs->register($validatedData);

        return response()->json($result, 201);
    }
}
