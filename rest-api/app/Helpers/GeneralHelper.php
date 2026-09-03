<?php

namespace App\Helpers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class GeneralHelper
{
    // public static function generateRandomString($length = 10)
    // {
    //     $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    //     $charactersLength = strlen($characters);
    //     $randomString = '';
    //     for ($i = 0; $i < $length; $i++) {
    //         $randomString .= $characters[rand(0, $charactersLength - 1)];
    //     }
    //     return $randomString;
    // }

    public static function generateAntrean($dokter, $jadwal_id, $kodepoli, $tanggalperiksa)
    {
        // $nomor = Antrian::where("jadwal_id", $jadwal_id)->whereDate("tanggalperiksa", $tanggalperiksa)->count() + 1;
        $nomor = DB::table('antrians')->where('jadwal_id', $jadwal_id)->whereDate('tanggalperiksa', date('Y-m-d'))->count() + 1;

        $nom = str_pad($nomor, 4, '0', STR_PAD_LEFT);
        $tanggalperiksa = date("dmY", strtotime($tanggalperiksa));
        $antrian = [
            "nomorantrean" => $kodepoli . "-" . $nom,
            "angkaantrean" => $nomor,
            "kodebooking" => $tanggalperiksa . $kodepoli . $dokter . $nom,
        ];
        return $antrian;
    }

    public static function generateAntreanNonBpjs($jadwal_id, $kodepoli, $tanggalperiksa)
    {
        $nomor = DB::table('antrians_non_bpjs')->where('jadwal_id', $jadwal_id)->whereDate('tanggalperiksa', date('Y-m-d'))->count() + 1;

        $nom = str_pad($nomor, 4, '0', STR_PAD_LEFT);
        $tanggalperiksa = date("dmY", strtotime($tanggalperiksa));
        $random = Str::upper(Str::random(4));
        $antrian = [
            "nomorantrean" => $kodepoli . "-" . $nom,
            "angkaantrean" => $nomor,
            "kdantrian" => $tanggalperiksa . $kodepoli . $random . $nom,
        ];
        return $antrian;
    }
}
