<?php
// ============================================================================
// test_connection.php — diagnosa koneksi Hostinger -> API server RS
// Upload bersama proxy.php lalu buka:
//   https://pendaftaran.rsi-jombang.id/test_connection.php
//
// >>> GANTI 0.0.0.0 dengan IP publik server RS (sama seperti di proxy.php)
// ============================================================================
error_reporting(E_ALL);
ini_set('display_errors', 1);

// >>> GANTI DI SINI <<<
$host = '0.0.0.0';
$port = 9999;

echo "<h2>Testing PHP Execution</h2>";
echo "PHP is working.<br>";

echo "<h2>Testing Outbound Connection to host $host port $port</h2>";
$timeout = 5;

$fp = @fsockopen($host, $port, $errno, $errstr, $timeout);
if (!$fp) {
    echo "<strong>FAILED:</strong> Could not connect to $host on port $port<br>";
    echo "Error Number: $errno<br>";
    echo "Error String: $errstr<br>";
    echo "<br><strong>DIAGNOSIS:</strong> Your hosting provider is likely blocking outbound " .
         "connections to non-standard ports (like $port).<br>";
    echo "You must ask your hosting support to: <strong>'Allow outgoing TCP connections " .
         "to $host on port $port'</strong>.";
} else {
    echo "<strong>SUCCESS:</strong> Connection to $host on port $port was successful.<br>";
    fclose($fp);
}

echo "<h2>Testing cURL Extension</h2>";
if (!function_exists('curl_init')) {
    echo "cURL is NOT available.<br>";
} else {
    echo "cURL is available (OK).<br>";
}

echo "<h2>Testing Request Through proxy.php</h2>";
if (function_exists('curl_init')) {
    $ch = curl_init('http://' . $host . ':' . $port . '/pendaftaran-online/rest-api/public/api/test');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    $out = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);
    if ($err) {
        echo "<strong>API FAILED:</strong> $err<br>";
    } else {
        echo "<strong>API HTTP $code:</strong> " . htmlspecialchars((string)$out) . "<br>";
    }
} else {
    echo "Skip (cURL unavailable).<br>";
}
?>