<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PatientController extends BaseController
{
    /**
     * Cek NIK pasien di tabel smis_rg_patient.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkNik(Request $request)
    {
        $validator = validator($request->all(), [
            'nik' => 'required|string|regex:/^[0-9]{16}$/',
        ]);

        if ($validator->fails()) {
            return $this->error(
                'NIK harus 16 digit dan hanya berisi angka.',
                Response::HTTP_UNPROCESSABLE_ENTITY,
                $validator->errors()
            );
        }

        $nik = $request->input('nik');

        // Cek apakah NIK sudah terdaftar
        $patient = DB::table('smis_rg_patient')
            ->where('ktp', $nik)
            ->first();

        // Juga cek NIK duplikat (data pasien berbeda dengan NIK sama)
        $duplicates = DB::table('smis_rg_patient')
            ->where('ktp', $nik)
            ->get();

        if ($duplicates->count() > 1) {
            return $this->error(
                'NIK terdeteksi ganda di sistem SIMRS. Silakan hubungi admin.',
                Response::HTTP_CONFLICT,
                null,
                [
                    'found' => true,
                    'patient' => $this->mapPatient($duplicates->first()),
                    'duplicate_count' => $duplicates->count(),
                ]
            );
        }

        if (!$patient) {
            return $this->success(
                [
                    'found' => false,
                    'patient' => null,
                ],
                'NIK tidak ditemukan.',
                Response::HTTP_OK
            );
        }

        return $this->success(
            [
                'found' => true,
                'patient' => $this->mapPatient($patient),
            ],
            'Pasien ditemukan.',
            Response::HTTP_OK
        );
    }

    /**
     * Daftarkan pasien baru ke tabel smis_rg_patient.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        $validator = validator($request->all(), [
            'nik' => 'required|string|regex:/^[0-9]{16}$/',
            'name' => 'required|string|max:127',
            'birth_date' => 'required|date_format:Y-m-d|before:today',
            'gender' => 'required|in:male,female',
            'address' => 'required|string|max:128',
            'phone' => 'required|string|max:25',
            'sebutan' => 'nullable|string|max:10',
            'birth_place' => 'nullable|string|max:25',
            'status' => 'nullable|string|max:32',
            'province_id' => 'nullable|string|max:20',
            'province_name' => 'nullable|string|max:127',
            'district_id' => 'nullable|string|max:20',
            'district_name' => 'nullable|string|max:127',
            'subdistrict_id' => 'nullable|string|max:20',
            'subdistrict_name' => 'nullable|string|max:127',
            'village_id' => 'nullable|string|max:20',
            'village_name' => 'nullable|string|max:127',
            'occupation' => 'nullable|string|max:50',
            'education' => 'nullable|string|max:48',
            'religion' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return $this->error(
                'Validasi gagal. Periksa kembali data yang dikirim.',
                Response::HTTP_UNPROCESSABLE_ENTITY,
                $validator->errors()
            );
        }

        $nik = $request->input('nik');

        // Cek duplikat NIK terlebih dahulu
        $existing = DB::table('smis_rg_patient')
            ->where('ktp', $nik)
            ->first();

        if ($existing) {
            return $this->error(
                'NIK sudah terdaftar di sistem SIMRS.',
                Response::HTTP_CONFLICT,
                null,
                $this->mapPatient($existing)
            );
        }

        $gender = ($request->input('gender') === 'female') ? 1 : 0;
        $birthDate = $request->input('birth_date');
        $birth = Carbon::parse($birthDate);

        // Hitung umur (contoh SIMRS: dibulatkan ke bawah)
        $age = $birth->diffInYears(Carbon::now());

        $sebutan = $request->input('sebutan');
        if (!$sebutan) {
            $sebutan = $request->input('gender') === 'female' ? 'Ny.' : 'Tn.';
        }

        $id = DB::table('smis_rg_patient')->insertGetId([
            'ihs_number' => '',
            'prop' => '',
            'tanggal' => Carbon::now()->format('Y-m-d'),
            'sebutan' => $sebutan,
            'nama' => $request->input('name'),
            'alamat' => $request->input('address'),
            'tempat_lahir' => $request->input('birth_place', ''),
            'tgl_lahir' => $birthDate,
            'status' => $request->input('status') ?: 'REGISTER',
            'kelamin' => $gender,
            'ktp' => $nik,
            'npwp' => null,
            'no_paspor' => null,
            'rt' => 0,
            'rw' => 0,
            'nama_provinsi' => $request->input('province_name', ''),
            'provinsi' => (int) $request->input('province_id', 0),
            'nama_kabupaten' => $request->input('district_name', ''),
            'kabupaten' => (int) $request->input('district_id', 0),
            'nama_kecamatan' => $request->input('subdistrict_name', ''),
            'kecamatan' => (int) $request->input('subdistrict_id', 0),
            'nama_kelurahan' => $request->input('village_name', ''),
            'kelurahan' => (int) $request->input('village_id', 0),
            'nama_kedusunan' => '',
            'kedusunan' => 0,
            'pekerjaan' => $request->input('occupation', ''),
            'pendidikan' => $request->input('education', ''),
            'telpon' => $request->input('phone'),
            'agama' => $request->input('religion', ''),
            'umur' => $age,
            'suami' => '',
            'istri' => '',
            'ayah' => '',
            'ibu' => '',
            'jenis' => '',
            'suku' => '',
            'bahasa' => '',
            'email' => '',
            'bbm' => '',
            'kartu' => 0,
            'gol_darah' => '',
            'document' => '',
            'keterangan' => '',
            'id_karyawan' => 0,
            'nama_karyawan' => '',
            'hubungan' => '',
            'synch' => 0,
            'fingerprint' => '',
            'fingerprint_proses' => '',
            'nobpjs' => '',
            'profile_number' => '',
            'alamat_keluarga' => '',
            'desa_keluarga' => '',
            'kecamatan_keluarga' => '',
            'kabupaten_keluarga' => '',
            'pekerjaan_keluarga' => '',
            'umur_keluarga' => '',
            'telepon_keluarga' => '',
            'autonomous' => '',
            'duplicate' => 0,
            'origin' => 'frontend',
            'origin_id' => 0,
            'time_updated' => Carbon::now()->format('Y-m-d H:i:s'),
            'origin_updated' => 'frontend',
        ]);

        $patient = DB::table('smis_rg_patient')->where('id', $id)->first();

        return $this->success(
            $this->mapPatient($patient),
            'Pasien baru berhasil didaftarkan.',
            Response::HTTP_CREATED
        );
    }

    /**
     * Map record smis_rg_patient ke payload frontend (PatientData shape).
     *
     * @param object $patient
     * @return array
     */
    protected function mapPatient($patient)
    {
        return [
            'id' => (string) $patient->id,
            'nik' => $patient->ktp,
            'name' => $patient->nama,
            'birth_date' => $patient->tgl_lahir,
            'gender' => ($patient->kelamin == 1) ? 'female' : 'male',
            'phone' => $patient->telpon,
            'address' => $patient->alamat,
            'sebutan' => $patient->sebutan,
            'birth_place' => $patient->tempat_lahir,
            'status' => $patient->status,
            'province_id' => (string) $patient->provinsi,
            'province_name' => $patient->nama_provinsi,
            'district_id' => (string) $patient->kabupaten,
            'district_name' => $patient->nama_kabupaten,
            'subdistrict_id' => (string) $patient->kecamatan,
            'subdistrict_name' => $patient->nama_kecamatan,
            'village_id' => (string) $patient->kelurahan,
            'village_name' => $patient->nama_kelurahan,
            'occupation' => $patient->pekerjaan,
            'education' => $patient->pendidikan,
            'religion' => $patient->agama,
        ];
    }
}
