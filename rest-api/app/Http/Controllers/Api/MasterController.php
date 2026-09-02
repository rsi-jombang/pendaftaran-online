<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class MasterController extends BaseController
{
    /**
     * Kode BPS resmi (34 provinsi) — mengecualikan baris duplikat/sampah (id 93, 96-124).
     */
    // const BPS_PROVINCE_IDS = [
    //     11, 12, 13, 14, 15, 16, 17, 18, 19, 21,
    //     31, 32, 33, 34, 35, 36,
    //     51, 52, 53,
    //     61, 62, 63, 64, 65,
    //     71, 72, 73, 74, 75, 76,
    //     81, 82,
    //     91, 92,
    // ];

    /**
     * Daftar provinsi (id = kode BPS resmi).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function provinsi()
    {
        $items = DB::table('smis_rg_propinsi')
            ->select('id as id', DB::raw('TRIM(nama) as nama'))
            ->whereNotNull('nama')
            ->where('prop', '!=', 'del')
            ->orderBy('nama')
            ->get();

        return $this->success($items, 'Data provinsi berhasil diambil.', Response::HTTP_OK);
    }

    /**
     * Daftar kabupaten/kota untuk suatu provinsi.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function kabupaten(Request $request)
    {
        $noProp = $request->query('no_prop');

        $query = DB::table('smis_rg_kabupaten')
            ->select('id as id', DB::raw('TRIM(nama) as nama'))
            ->whereNotNull('nama')
            ->where('id', '<', 9000); // buang baris sampah/duplikat ber-id 9xxx

        if ($noProp !== null && $noProp !== '') {
            $query->where('no_prop', $noProp);
        }

        $items = $query->orderBy('nama')->get();

        return $this->success($items, 'Data kabupaten berhasil diambil.', Response::HTTP_OK);
    }

    /**
     * Daftar kecamatan untuk suatu kabupaten.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function kecamatan(Request $request)
    {
        $noKab = $request->query('no_kab');
        $noProp = $request->query('no_prop');

        $query = DB::table('smis_rg_kec')
            ->select('id as id', DB::raw('TRIM(nama) as nama'))
            ->whereNotNull('nama')
            ->where('no_prop', '!=', 'del');

        if ($noKab !== null && $noKab !== '') {
            $query->where('no_kab', $noKab);
        }

        if ($noProp !== null && $noProp !== '') {
            $query->where('no_prop', $noProp);
        }

        $items = $query->orderBy('nama')->get();

        return $this->success($items, 'Data kecamatan berhasil diambil.', Response::HTTP_OK);
    }

    /**
     * Daftar kelurahan untuk suatu kecamatan.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function kelurahan(Request $request)
    {
        $noKec = $request->query('no_kec');

        $query = DB::table('smis_rg_kelurahan')
            ->select('id as id', DB::raw('TRIM(nama) as nama'))
            ->whereNotNull('nama');

        if ($noKec !== null && $noKec !== '') {
            $query->where('no_kec', $noKec);
        }

        $items = $query->orderBy('nama')->get();

        return $this->success($items, 'Data kelurahan berhasil diambil.', Response::HTTP_OK);
    }

    /**
     * Daftar Asuransi.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function asuransi()
    {
        $items = DB::table('smis_rg_asuransi')
            ->select('id as id', DB::raw('TRIM(nama) as nama'))
            ->whereNotNull('nama')
            ->where('prop', '!=', 'del')
            ->whereNotIn('nama', ['BPJS Kesehatan', 'BPJS PBI'])
            ->orderBy('nama')
            ->get();

        return $this->success($items, 'Data asuransi berhasil diambil.', Response::HTTP_OK);
    }

    /**
     * Daftar Perusahaan.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function perusahaan()
    {
        $items = DB::table('smis_rg_perusahaan')
            ->select('id as id', DB::raw('TRIM(nama) as nama'))
            ->whereNotNull('nama')
            ->where('prop', '!=', 'del')
            ->orderBy('nama')
            ->get();

        return $this->success($items, 'Data perusahaan berhasil diambil.', Response::HTTP_OK);
    }
}
