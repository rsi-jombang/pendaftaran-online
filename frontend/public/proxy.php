<?php
// ============================================================================
// proxy.php — bypass Mixed Content (HTTPS frontend -> HTTP API server RS)
// Dipakai di hosting frontend (Hostinger cPanel). Browser hanya melihat
// https://pendaftaran.rsi-jombang.id/proxy.php/... (same-origin, HTTPS),
// lalu PHP di sini meneruskan request ke API asli secara server-to-server.
//
// Base API asli: http://<IP_PUBLIK>:<PORT>/pendaftaran-online/rest-api/public/api
//
// >>> GANTI 0.0.0.0 dengan IP publik server RS yang sudah terbukti jalan:
//     test http://IP_PUBLIK:9999/pendaftaran-online/rest-api/public/api/test
// ============================================================================

// Produksi: jangan tampilkan error ke browser
error_reporting(0);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

const PROXY_PREFIX = '/proxy.php';

// >>> GANTI DI SINI <<<
$apiBaseUrl = 'http://0.0.0.0:9999/pendaftaran-online/rest-api/public/api';

// Sama-origin tidak butuh CORS, tapi header ini aman untuk uji manual lintas-origin
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept, X-API-KEY');

// Preflight langsung jawab 204 (browser same-origin tidak memicu ini)
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if (!function_exists('curl_init')) {
    http_response_code(500);
    echo '{"error":"cURL is not enabled on this server"}';
    exit;
}

// Ambil endpoint dari PATH setelah /proxy.php, query string di-forward apa adanya
$uri    = $_SERVER['REQUEST_URI'] ?? '/';
$path   = parse_url($uri, PHP_URL_PATH);
$query  = parse_url($uri, PHP_URL_QUERY);

if (strncmp($path, PROXY_PREFIX, strlen(PROXY_PREFIX)) !== 0) {
    http_response_code(400);
    echo '{"error":"Bad path: expected prefix /proxy.php"}';
    exit;
}

$endpoint = ltrim(substr($path, strlen(PROXY_PREFIX)), '/');
if ($endpoint === '') {
    http_response_code(400);
    echo '{"error":"No endpoint provided"}';
    exit;
}

$url = $apiBaseUrl . '/' . $endpoint;
if ($query) {
    $url .= '?' . $query;
}

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 20);

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$headers = array(
    'Accept: application/json',
    'Content-Type: application/json',
);

if ($method !== 'GET' && $method !== 'HEAD') {
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    $inputData = file_get_contents('php://input');
    if ($inputData !== '') {
        curl_setopt($ch, CURLOPT_POSTFIELDS, $inputData);
        $headers[] = 'Content-Length: ' . strlen($inputData);
    }
}
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$response  = curl_exec($ch);
$httpCode  = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

header('Content-Type: application/json');

if ($curlError) {
    http_response_code(502);
    echo '{"error":"proxy cURL error: ' . addslashes($curlError) . '"}';
    exit;
}

http_response_code($httpCode ?: 200);
echo $response ?: '{"error":"Empty response from API","status":' . $httpCode . '}';