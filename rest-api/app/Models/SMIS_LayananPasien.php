<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SMIS_LayananPasien extends Model
{
    // use HasFactory;

    protected $table = 'smis_rg_layananpasien';

    public $incrementing = false;

    protected $keyType = 'string';
}
