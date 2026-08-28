<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PoliController extends BaseController
{
    public function index()
    {
        return $this->success([
            'message' => 'Hello, this is an AJAX request response!',
            'status' => 'success'
        ], 'null', Response::HTTP_OK);
    }

    public function get_poli()
    {
        $polis_bpjs = DB::table('smis_rg_jadwal_poli')
            ->select(
                'kodepoli_bpjs',
                'nama_poli',
                'slug_poli',

                DB::raw('COUNT(DISTINCT id_dokter) AS jumlah_dokter'),

                DB::raw("
            GROUP_CONCAT(
                DISTINCT CONCAT(jam_mulai, ' - ', jam_selesai)
                ORDER BY jam_mulai
                SEPARATOR ', '
            ) AS jam_praktek
        "),

                DB::raw("
            CASE
                WHEN SUM(
                    CASE
                        WHEN CURTIME() BETWEEN jam_mulai AND jam_selesai
                        THEN 1
                        ELSE 0
                    END
                ) > 0
                THEN 'BUKA'

                WHEN SUM(
                    CASE
                        WHEN jam_mulai > CURTIME()
                        THEN 1
                        ELSE 0
                    END
                ) > 0
                THEN 'BELUM BUKA'

                ELSE 'TUTUP'
            END AS status
        ")
            )

            // HANYA JADWAL HARI INI
            ->whereRaw('hari = WEEKDAY(CURDATE()) + 1')

            ->groupBy(
                'kodepoli_bpjs',
                'nama_poli',
                'slug_poli'
            )

            ->orderBy('nama_poli')
            ->get();


        $polis_non_bpjs = DB::table('smis_rg_jadwal_poli_non_bpjs')
            ->select(
                'kode_poli',
                'nama_poli',
                'slug_poli',

                DB::raw('COUNT(DISTINCT id_dokter) AS jumlah_dokter'),

                DB::raw("
            GROUP_CONCAT(
                DISTINCT CONCAT(jam_mulai, ' - ', jam_selesai)
                ORDER BY jam_mulai
                SEPARATOR ', '
            ) AS jam_praktek
        "),

                DB::raw("
            CASE
                WHEN SUM(
                    CASE
                        WHEN CURTIME() BETWEEN jam_mulai AND jam_selesai
                        THEN 1
                        ELSE 0
                    END
                ) > 0
                THEN 'BUKA'

                WHEN SUM(
                    CASE
                        WHEN jam_mulai > CURTIME()
                        THEN 1
                        ELSE 0
                    END
                ) > 0
                THEN 'BELUM BUKA'

                ELSE 'TUTUP'
            END AS status
        ")
            )

            // HANYA JADWAL HARI INI
            ->whereRaw('hari = WEEKDAY(CURDATE()) + 1')

            ->groupBy(
                'kode_poli',
                'nama_poli',
                'slug_poli'
            )

            ->orderBy('nama_poli')
            ->get();

        $polis = $polis_bpjs->merge($polis_non_bpjs);

        if ($polis->isEmpty()) {
            return $this->error('Tidak ada data poli non BPJS yang tersedia hari ini.', Response::HTTP_NOT_FOUND);
        }

        return $this->success($polis, 'Data poli non BPJS yang tersedia hari ini.', Response::HTTP_OK);
    }

    public function get_poli_by_slug(string $slug_poli)
    {
        $poli = DB::table('smis_rg_jadwal_poli')
            ->where('slug_poli', $slug_poli)
            ->first();

        if (!$poli) {
            $poli = DB::table('smis_rg_jadwal_poli_non_bpjs')
                ->where('slug_poli', $slug_poli)
                ->first();
        }

        if (!$poli) {
            return $this->error('Poli tidak ditemukan.', Response::HTTP_NOT_FOUND);
        }

        return $this->success($poli, 'Data poli berhasil diambil.', Response::HTTP_OK);
    }

    /**
     * Get jadwal dokter per poli per tanggal
     *
     * @param Request $request
     * @param string $slug_poli
     * @return \Illuminate\Http\JsonResponse
     */
    public function get_jadwal_poli(Request $request, string $slug_poli)
    {
        $date = $request->get('date', Carbon::now()->format('Y-m-d'));

        try {
            $dateObj = Carbon::parse($date);
        } catch (\Exception $e) {
            return $this->error('Format tanggal tidak valid. Gunakan format Y-m-d.', Response::HTTP_BAD_REQUEST);
        }

        // Convert date to hari (1=Senin...7=Minggu)
        // Carbon dayOfWeekIso: 1=Senin...7=Minggu
        $hari = $dateObj->dayOfWeekIso;

        // Query BPJS dengan join ke smis_hrd_employee untuk nama dan jk
        // Left join ke antrians via subquery untuk ambil sisa kuota (data terakhir by jadwal_id + tanggalperiksa)
        $latestAntrian = DB::table('antrians')
            ->select('jadwal_id', DB::raw('MAX(id) as max_id'))
            ->where('tanggalperiksa', $date)
            ->groupBy('jadwal_id');

        $bpjs = DB::table('smis_rg_jadwal_poli as jp')
            ->join('smis_hrd_employee as e', 'jp.id_dokter', '=', 'e.id')
            ->leftJoinSub($latestAntrian, 'la', 'jp.id', '=', 'la.jadwal_id')
            ->leftJoin('antrians as a', 'a.id', '=', 'la.max_id')
            ->where('jp.slug_poli', $slug_poli)
            ->where('jp.hari', $hari)
            ->select([
                'jp.id as jadwal_id',
                'jp.id_dokter as id',
                'e.nama as name',
                'e.jk',
                'jp.jam_mulai',
                'jp.jam_selesai',
                'a.sisakuotanonjkn as quota_remaining',
                DB::raw("'bpjs' as source")
            ])
            ->get();

        // Non-BPJS (tidak ada quota - unlimited)
        $nonBpjs = DB::table('smis_rg_jadwal_poli_non_bpjs as jp')
            ->join('smis_hrd_employee as e', 'jp.id_dokter', '=', 'e.id')
            ->where('jp.slug_poli', $slug_poli)
            ->where('jp.hari', $hari)
            ->select([
                'jp.id_dokter as id',
                'e.nama as name',
                'e.jk',
                'jp.jam_mulai',
                'jp.jam_selesai',
                DB::raw("NULL as quota_remaining"),
                DB::raw("'unlimited' as quota_status"),
                DB::raw("'non_bpjs' as source")
            ])
            ->get();

        // Merge dan sort by jam_mulai
        $jadwal = $bpjs->merge($nonBpjs)->sortBy('jam_mulai')->values();

        // Format response
        $doctors = $jadwal->map(function ($doc) {
            // Determine status based on current time
            $now = Carbon::now()->format('H:i:s');
            $status = 'TUTUP';
            if ($now >= $doc->jam_mulai && $now <= $doc->jam_selesai) {
                $status = 'BUKA';
            } elseif ($now < $doc->jam_mulai) {
                $status = 'BELUM BUKA';
            }

            // Avatar lokal berdasarkan jenis kelamin (jk: 0=laki-laki, 1=perempuan)
            $gender = ($doc->jk == 1) ? 'female' : 'male';
            $avatarUrl = "/doctor-{$gender}.png";

            return [
                'id' => (int) $doc->id,
                'name' => $doc->name,
                'avatar_url' => $avatarUrl,
                'practice_hours' => $doc->jam_mulai . ' - ' . $doc->jam_selesai,
                'quota_remaining' => $doc->quota_remaining !== null ? (int) $doc->quota_remaining : null,
                'quota_status' => $doc->quota_remaining !== null
                    ? ($doc->quota_remaining > 0 ? 'available' : 'full')
                    : 'unlimited',
                'status' => $status,
                'source' => $doc->source,
            ];
        });

        // Get poli info - sequential lookup to avoid UNION column mismatch
        $poliInfo = DB::table('smis_rg_jadwal_poli')
            ->where('slug_poli', $slug_poli)
            ->select('slug_poli', 'nama_poli')
            ->first();

        if (!$poliInfo) {
            $poliInfo = DB::table('smis_rg_jadwal_poli_non_bpjs')
                ->where('slug_poli', $slug_poli)
                ->select('slug_poli', 'nama_poli')
                ->first();
        }

        if (!$poliInfo) {
            return $this->error('Poli tidak ditemukan.', Response::HTTP_NOT_FOUND);
        }

        $responseData = [
            'poli' => [
                'id' => $poliInfo->slug_poli,
                'name' => $poliInfo->nama_poli,
            ],
            'date' => $date,
            'doctors' => $doctors,
        ];

        return $this->success($responseData, 'Jadwal dokter berhasil diambil.', Response::HTTP_OK);
    }
}
