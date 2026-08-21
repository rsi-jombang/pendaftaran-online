<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use Illuminate\Http\Request;

abstract class BaseController extends Controller
{
    use ApiResponse;
}
