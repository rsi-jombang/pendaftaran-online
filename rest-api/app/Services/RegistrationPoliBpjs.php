<?php

namespace App\Services;

use App\Models\JadwalPoli;
use App\Models\SMIS_Pasien;

class RegistrationPoliBpjs
{
    public function register($data)
    {
        // Implement the registration logic for non-BPJS patients here
        // This is a placeholder for the actual implementation
        return true;
    }

    public function valid($param)
    {
        // Implement the validation logic for non-BPJS patients here
        // This is a placeholder for the actual implementation
        // $pasien = SMIS_Pasien::findOrFail($param['patient_id']);
        // $poli = $param['kodePoli'];
        // $jadwal = new JadwalPoli();
        // // jika poli tidak ada
        // $jadwal = $jadwal->where("kodepoli_bpjs", $poli);
        // if(is_null($jadwal->first())){
        //     return $this->errorResponse("Poli tidak ditemukan", 404);
        // }
        // return true;
    }
}
