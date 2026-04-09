<?php
$allowedOrigins = [
    'https://head-digital-pool.ch',
    'http://localhost:3000',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
}

header('Content-Type: application/json');

$envFile = __DIR__ . '/.env.local';
if (file_exists($envFile)) {
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) continue;
        [$key, $val] = explode('=', $line, 2);
        $_ENV[trim($key)] = trim($val);
        putenv(trim($key) . '=' . trim($val));
    }
}

$token = $_ENV['GITHUB_TOKEN'] ?? getenv('GITHUB_TOKEN');
if (!$token) {
    http_response_code(500);
    echo json_encode(['error' => 'No GitHub token configured']);
    exit;
}

$org = 'headpoolnumerique';
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => "https://api.github.com/orgs/$org/repos?per_page=100",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer $token",
        "Accept: application/vnd.github+json",
        "User-Agent: headpoolnumerique",
    ],
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if ($response === false) {
    http_response_code(500);
    echo json_encode(['error' => 'cURL error: ' . curl_error($ch)]);
    curl_close($ch);
    exit;
}

curl_close($ch);

if ($httpCode !== 200) {
    http_response_code($httpCode);
    echo json_encode(['error' => 'GitHub API error', 'status' => $httpCode]);
    exit;
}

$repos = json_decode($response, true);
$filtered = array_values(array_filter($repos, fn($r) => in_array('digitalpoolhead', $r['topics'] ?? [])));

echo json_encode($filtered);
