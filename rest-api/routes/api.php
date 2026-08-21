<?php

use Illuminate\Support\Facades\Route;

Route::middleware(['throttle:api'])->group(function () {
    Route::get('/test', function () {
        return response()->json([
            'success' => true,
            'message' => 'API is working',
            'data' => [
                'version' => '1.0.0',
                'timestamp' => now()->toISOString(),
            ],
        ]);
    });

    Route::prefix('v1')->group(function () {
        Route::middleware(['throttle:api-register'])->group(function () {
            Route::post('/patients', 'App\Http\Controllers\Api\PatientController@store');
        });

        Route::middleware(['throttle:api'])->group(function () {
            // Route::get('/polis', 'App\Http\Controllers\Api\PoliController@index');
            // Route::get('/polis/{id}', 'App\Http\Controllers\Api\PoliController@show');
            // Route::get('/patients/{nik}', 'App\Http\Controllers\Api\PatientController@show');
            // Route::post('/antrians', 'App\Http\Controllers\Api\AntrianController@store');
            // Route::get('/antrians/hari-ini', 'App\Http\Controllers\Api\AntrianController@today');
            // Route::get('/antrians/{id}', 'App\Http\Controllers\Api\AntrianController@show');
        });

        // Route::middleware(['throttle:api-auth'])->group(function () {
        //     Route::put('/antrians/{id}/panggil', 'App\Http\Controllers\Api\AntrianController@panggil');
        //     Route::put('/antrians/{id}/selesai', 'App\Http\Controllers\Api\AntrianController@selesai');
        //     Route::put('/antrians/{id}/batal', 'App\Http\Controllers\Api\AntrianController@batal');
        // });
    });
});

Route::fallback(function () {
    return response()->json([
        'success' => false,
        'message' => 'Endpoint tidak ditemukan',
        'data' => null,
        'errors' => null,
    ], 404);
});
