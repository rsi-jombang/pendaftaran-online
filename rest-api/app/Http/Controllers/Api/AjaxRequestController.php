<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AjaxRequestController extends BaseController
{
    public function index()
    {
        return $this->success([
            'message' => 'Hello, this is an AJAX request response!',
            'status' => 'success'
        ], 'null', Response::HTTP_OK);
    }

    public function get_poli_non_bpjs()
    {

    }
}
