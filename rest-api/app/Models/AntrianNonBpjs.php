<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AntrianNonBpjs extends Model
{
    protected $table = 'antrians_non_bpjs';
    protected $primaryKey = 'id';
    protected $guarded = ['id'];
}
