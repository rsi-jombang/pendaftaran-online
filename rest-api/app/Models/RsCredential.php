<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RsCredential extends Model
{
    use HasFactory;

    protected $table = 'rs_credentials';

    protected $fillable = ['cons_id', 'cons_secret', 'user_key', 'base_url', 'layanan', 'kode_ppk', 'nama_rs'];
}
