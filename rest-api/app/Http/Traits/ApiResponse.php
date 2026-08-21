<?php

namespace App\Http\Traits;

use Illuminate\Http\JsonResponse;
use Illuminate\Pagination\LengthAwarePaginator;

trait ApiResponse
{
    protected function success($data = null, string $message = 'Success', int $code = 200, array $meta = null): JsonResponse
    {
        $response = [
            'success' => true,
            'message' => $message,
            'data' => $data,
        ];

        if ($meta !== null) {
            $response['meta'] = $meta;
        }

        return response()->json($response, $code);
    }

    protected function error(string $message = 'Error', int $code = 400, $errors = null, $data = null): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'data' => $data,
            'errors' => $errors,
        ], $code);
    }

    protected function paginated(LengthAwarePaginator $paginator, string $message = 'Success'): JsonResponse
    {
        return $this->success($paginator->items(), $message, 200, [
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'per_page' => $paginator->perPage(),
            'total' => $paginator->total(),
            'from' => $paginator->firstItem(),
            'to' => $paginator->lastItem(),
        ]);
    }
}