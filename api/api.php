<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, X-Impacto-Token');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
$config = require __DIR__ . '/config.php';
$token = $_SERVER['HTTP_X_IMPACTO_TOKEN'] ?? '';
if (!hash_equals((string)$config['token'], (string)$token)) {
  http_response_code(401); echo json_encode(['ok'=>false,'error'=>'Não autorizado']); exit;
}
try {
  $pdo = new PDO(
    'mysql:host='.$config['host'].';dbname='.$config['dbname'].';charset=utf8mb4',
    $config['user'], $config['pass'],
    [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC]
  );
  $action = $_GET['action'] ?? 'load';
  if ($action === 'load') {
    $row = $pdo->query("SELECT payload, updated_at FROM impacto_app_state WHERE state_key='main' LIMIT 1")->fetch();
    if (!$row) { echo json_encode(['ok'=>true,'data'=>null,'updatedAt'=>0]); exit; }
    $data = json_decode($row['payload'], true);
    echo json_encode(['ok'=>true,'data'=>$data,'updatedAt'=>(int)$row['updated_at']]); exit;
  }
  if ($action === 'save' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true);
    if (!is_array($body) || !isset($body['data'])) { http_response_code(400); echo json_encode(['ok'=>false,'error'=>'Payload inválido']); exit; }
    $updatedAt = (int)($body['updatedAt'] ?? round(microtime(true)*1000));
    $payload = json_encode($body['data'], JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);
    $stmt = $pdo->prepare("INSERT INTO impacto_app_state(state_key,payload,updated_at) VALUES('main',?,?) ON DUPLICATE KEY UPDATE payload=VALUES(payload), updated_at=VALUES(updated_at)");
    $stmt->execute([$payload,$updatedAt]);
    echo json_encode(['ok'=>true,'updatedAt'=>$updatedAt]); exit;
  }
  http_response_code(400); echo json_encode(['ok'=>false,'error'=>'Ação inválida']);
} catch (Throwable $e) {
  http_response_code(500); echo json_encode(['ok'=>false,'error'=>'Erro interno do banco']);
}
