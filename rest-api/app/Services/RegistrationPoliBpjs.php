<?php

namespace App\Services;

use App\Models\Antrian;
use App\Models\JadwalPoli;
use App\Models\RsCredential;
use App\Models\SMIS_Pasien;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Validator;

class RegistrationPoliBpjs
{
    public function register($data)
    {
        $valid = $this->valid($data);
        if ($valid['success'] !== true) {
            return $valid['message'];
        }

        $poli = $data['kodePoli'];
        $jadwal = $valid['data']['jadwal'];
        $pasien = $valid['data']['pasien'];
        $sisaKuotaNonJkn = $valid['data']['sisakuotanonjkn'];
        $sisaKuotaJkn = $valid['data']['sisakuotajkn'];
        $generate = \App\Helpers\GeneralHelper::generateAntrean($jadwal['kodedokter_bpjs'], $jadwal['id'],$poli, $data['date']);
        $mili = strtotime($data['date'] . ' ' . $jadwal['jam_mulai']);
        $estimasi = ($mili * 1000) + (($generate['angkaantrean'] - 1) * ($jadwal->estimasi_layanan * 60000));

        if (isset($pasien->nik)) {
            if ($pasien->origin_updated != 'verified') {
                return [
                    'status' => false,
                    'message' => 'No. rekam medis anda ' . $pasien['nrm'] . ' tersebut hanya bersifat sementara. Harap datang ke admisi untuk verifikasi & melengkapi data rekam medis dengan membawa kartu identitas, pastikan data anda benar-benar valid & belum pernah terdaftar di RSUD SLG',
                    'code' => 201
                ];
            }
        } else {
            if ($pasien->origin_updated == 'mobile-jkn') {
                return [
                    'status' => false,
                    'message' => 'No. rekam medis anda ' . $pasien['id'] . ' tersebut hanya bersifat sementara. Harap datang ke admisi untuk verifikasi & melengkapi data rekam medis dengan membawa kartu identitas, pastikan data anda benar-benar valid & belum pernah terdaftar di RSUD SLG',
                    'code' => 201
                ];
            }
        }

        $count_baru_lama = \App\Models\SMIS_LayananPasien::where('nrm', $pasien->id)->count();
        $antrian = new Antrian();
        if ($count_baru_lama > 0) {
            $antrian->pasien_baru = 0;
        } else {
            $antrian->pasien_baru = 1;
        }

        $jp = $data['payment_method'] ? explode("-", $data['payment_method']) : [''];

        $antrian->taskid = 0;
        $antrian->alodokter = 0;
        $antrian->nomorreferensi = '';
        $antrian->tanggalperiksa = $data['date'];
        $antrian->namapj = $data['responsible_name'] ? $data['responsible_name'] : '';
        $antrian->telppj = $data['responsible_phone'] ? $data['responsible_phone'] : '';
        $antrian->jadwal_id = $jadwal['id'];
        $antrian->carabayar = $jp[0] ? $jp[0] : '';
        $antrian->asuransi = isset($data['insurance_id']) ? $data['insurance_id'] : 0;
        $antrian->perusahaan = isset($data['company_id']) ? $data['company_id'] : 0;
        $antrian->nomorantrean = $generate['nomorantrean'];
        $antrian->angkaantrean = $generate['angkaantrean'];
        $antrian->kodebooking = $generate['kodebooking'];
        $antrian->norm = $pasien['id'];
        $antrian->namapoli = $jadwal['nama_poli'];
        $antrian->namadokter = $jadwal['nama_dokter'];
        $antrian->estimasidilayani = $estimasi; // masih salah harus di ganti
        $antrian->sisakuotajkn = $sisaKuotaJkn;
        $antrian->sisakuotanonjkn = $sisaKuotaNonJkn;
        $antrian->kuotajkn = $jadwal['kuota_jkn'];
        $antrian->kuotanonjkn = $jadwal['kuota_non_jkn'];
        $antrian->kedatangan = 'Datang Sendiri';
        $antrian->jenis_perujuk = '';
        $antrian->id_perujuk = 0;
        $antrian->alasan_non_mjkn = '';
        $antrian->keterangan = 'Peserta harap 60 menit lebih awal guna pencatatan administrasi.';
        $antrian->created_at = date('Y-m-d H:i:s', strtotime('now'));
        $antrian->updated_at = date('Y-m-d H:i:s', strtotime('now'));

        $param_antrian_bpjs = json_encode([
            'kodebooking' => $generate['kodebooking'],
            'jenispasien' => 'NON JKN',
            'nomorkartu' => '-',
            'nik' => $data['patient_nik'],
            'nohp' => $pasien['telpon'],
            'kodepoli' => $jadwal['kodepoli_bpjs'],
            'namapoli' => $jadwal['nama_poli'],
            'pasienbaru' => $antrian->pasien_baru,
            'norm' => $pasien['id'],
            'tanggalperiksa' => $antrian->tanggalperiksa,
            'kodedokter' => (int)$jadwal['kodedokter_bpjs'],
            'namadokter' => $jadwal['nama_dokter'],
            'jampraktek' => $jadwal['jam_mulai'] . '-' . $jadwal['jam_selesai'],
            'jeniskunjungan' => 3,
            'nomorreferensi' => '',
            'nomorantrean' => $generate['nomorantrean'],
            'angkaantrean' => $generate['angkaantrean'],
            'estimasidilayani' => $estimasi,
            "sisakuotajkn" => $sisaKuotaJkn,
            "kuotajkn" => $jadwal['kuota_jkn'],
            "sisakuotanonjkn" => $sisaKuotaNonJkn,
            "kuotanonjkn" => $jadwal['kuota_non_jkn'],
            "keterangan" => $antrian->keterangan
        ]);

        $response = $this->post_bpjs('antrean/add', $param_antrian_bpjs);

        if ($response['status']) {
            if ($response['code'] == 200) {
                $antrian->response_code = 200;
                $antrian->response_message = 'Ok';
                $antrian->save();
                $ktp = $pasien->nik ? $pasien->nik : $pasien->ktp;
                return [
                    'status' => true,
                    'message' => 'Ok',
                    'pasien' => $pasien,
                    'antrian' => $antrian,
                    'code' => 200,
                ];
            } else {
                return [
                    'status' => false,
                    'message' => $response['message'],
                    'code' => 201,
                ];
            }
        } else {
            return [
                'status' => false,
                'message' => $response['message'],
                'code' => 201
            ];
        }
    }

    public function valid($param)
    {
        // Implement the validation logic for non-BPJS patients here
        // This is a placeholder for the actual implementation
        // $pasien = SMIS_Pasien::findOrFail($param['patient_id']);
        $poli = $param['kodePoli'];
        $jadwal = new JadwalPoli();
        // jika poli tidak ada
        $jadwal = $jadwal->where("kodepoli_bpjs", $poli);

        if(is_null($jadwal->first())){
            return [
                'success' => false,
                'message' => "Poli tidak ditemukan",
                'data' => null,
                'errors' => null,
            ];
        }

        // jika format tanggal salah
        $checkTgl = Validator::make(["tanggalperiksa" => $param['date']], [
            'tanggalperiksa' => 'date_format:Y-m-d',
        ]);

        if ($checkTgl->fails()) {
            return [
                'success' => false,
                'message' => "Format tanggal salah, gunakan format Y-m-d",
                'data' => null,
                'errors' => $checkTgl->errors(),
            ];
        }

        // jika tanggal telah berlalu
        if(date("Y-m-d") > $param['date']){
            return [
                'success' => false,
                'message' => "Tanggal periksa yang dimasukkan telah berlalu",
                'data' => null,
                'errors' => null,
            ];
        }

        // jika format jam praktik salah
        $jampraktik = explode(" - ", $param['practiceHours']);
        if(count($jampraktik) < 2 || ($jampraktik[0] == "" && $jampraktik[1] == "")){
            return [
                'success' => false,
                'message' => "Format jam praktik salah, gunakan format HH:MM-HH:MM",
                'data' => null,
                'errors' => null,
            ];
        }

        $sekarang = strtotime(date_create('now')->format('Y-m-d H:i'));
        $str_jadwal = strtotime($param['date'] . ' ' . $jampraktik[1]);
        if($str_jadwal < $sekarang){
            return [
                'success' => false,
                'message' => "Pendaftaran ke poli ini telah ditutup karena jam praktik telah berakhir",
                'data' => null,
                'errors' => null,
            ];
        }

        // jika jadwal tidak ada
        $hari = date("N", strtotime($param['date']));
        $jadwal = $jadwal->where("hari", $hari);
        $jadwal = $jadwal->where("jam_mulai", $jampraktik[0]);
        $jadwal = $jadwal->where("jam_selesai", $jampraktik[1])->first();
        if (is_null($jadwal)) {
            return [
                'success' => false,
                'message' => "Jadwal poli tidak ditemukan",
                'data' => null,
                'errors' => null,
            ];
        }

        if($jadwal->libur){
            return [
                'success' => false,
                'message' => "Jadwal poli ini sedang libur, silahkan reschedule di jam praktek lainnya.",
                'data' => null,
                'errors' => null,
            ];
        }

        $pasien = SMIS_Pasien::where("ktp", $param['patient_nik'])->where('prop', '')->first();
        if (is_null($pasien)) {
            $pasien = \App\Models\Mjkn_Patient::where('nik', $param['patient_nik'])->first();
        }

        if (is_null($pasien)) {
            return [
                'success' => false,
                'message' => "Data Pasien tidak ditemukan, silahkan daftar baru.",
                'data' => null,
                'errors' => null,
            ];
        }

        $lastAntrian = Antrian::where(['jadwal_id' => $jadwal->id, 'tanggalperiksa' => $param['date']])->orderBy("id", "desc")->first();
        // sisa antrian jkn
        if (!is_null($lastAntrian)) {
            $sisakuotanonjkn = $lastAntrian->sisakuotanonjkn;
            $sisakuotajkn = $lastAntrian->sisakuotajkn;
        } else {
            $sisakuotanonjkn = $jadwal->kuota_non_jkn;
            $sisakuotajkn = $jadwal->kuota_jkn;
        }

        if ($sisakuotanonjkn <= 0) {
            return [
                'success' => false,
                'message' => "Kuota pendaftaran poli ini telah penuh, silahkan reschedule di jam praktek lainnya.",
                'data' => null,
                'errors' => null,
            ];
        } else {
            $sisakuotanonjkn = $sisakuotanonjkn - 1;
        }

        // jika sudah ambil antrian
        if (!is_null(Antrian::where(['jadwal_id' => $jadwal->id, 'tanggalperiksa' => $param['date']])->where("norm", $pasien->id)->where('taskid', '!=', 99)->first()))
        {
            return [
                'success' => false,
                'message' => "Pasien ini sudah terdaftar di jadwal poli ini, silahkan reschedule di jam praktek lainnya.",
                'data' => null,
                'errors' => null,
            ];
        }
        // jika validasi sudah benar
        return [
            'success' => true,
            'message' => "Validasi berhasil",
            'data' => [
                'sisakuotanonjkn' => $sisakuotanonjkn,
                'sisakuotajkn' => $sisakuotajkn,
                'jadwal' => $jadwal,
                'pasien' => $pasien,
            ],
            'errors' => null,
        ];
    }

    function post_bpjs($url, $data)
    {
        $credentials = RsCredential::where('layanan', 'antrian')->first();
        // return response()->json($credentials);
        if ($credentials == null) {
            return [
                'status' => false,
                'message' => 'Credential RS tidak ditemukan'
            ];
        }
        try {
            date_default_timezone_set('UTC');
            $timeStamp = strval(time() - strtotime('1970-01-01 00:00:00'));
            $signature = $this->get_signature($timeStamp, $credentials->cons_id, $credentials->cons_secret);
            $guzzleClient = new Client([
                'verify' => false
            ]);
            $response = $guzzleClient->request('post', $credentials->base_url . '/' . $url, [
                'headers' => [
                    'x-cons-id'     => $credentials->cons_id,
                    'x-timestamp'  => $timeStamp,
                    'x-signature'   => $signature,
                    'user_key' => $credentials->user_key,
                ],
                'body' => $data
            ]);
            if ($response->getStatusCode() == 200) {
                $list = json_decode($response->getBody()->getContents());
                if ($list->metadata->code == 201) {
                    return [
                        'status' => 'true',
                        'message' => $list->metadata->message,
                        'code' => $list->metadata->code
                    ];
                }
                return [
                    'status' => 'true',
                    'message' => $list->metadata->message,
                    'code' => $list->metadata->code
                ];
            } else {
                return [
                    'status' => 'false',
                    'message' => 'Gagal terhubung ke bpjs'
                ];
            }
        } catch (\Throwable $th) {
            return [
                'status' => 'false',
                'message' => $th->getMessage()
            ];
        }
    }

    function get_signature($timeStamp, $cons_id, $cons_secret)
    {
        $signature = hash_hmac('sha256', $cons_id . "&" . $timeStamp, $cons_secret, true);
        $encodedSignature = base64_encode($signature);
        return $encodedSignature;
    }
}
