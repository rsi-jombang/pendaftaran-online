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
        });

        Route::middleware(['throttle:api'])->group(function () {
            Route::group(['controller' => 'App\Http\Controllers\Api\PoliController'], function () {
                Route::get('/poli-data', 'get_poli');
                Route::get('/poli/{slug_poli}', 'get_poli_by_slug');
                Route::get('/poli/{slug_poli}/schedules', 'get_jadwal_poli');
            });
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
