<?php
/* ────────────────────────────────────────────────
   BigDance School – Invio form contatti
   File: invia.php
   Richiede: PHP con mail() abilitato (qualsiasi
   hosting shared standard lo supporta).
──────────────────────────────────────────────── */

header('Content-Type: application/json; charset=utf-8');

/* Solo richieste POST */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'msg' => 'Metodo non consentito.']);
    exit;
}

/* ── Raccolta e sanificazione dei dati ── */
function clean(string $v): string {
    return htmlspecialchars(strip_tags(trim($v)), ENT_QUOTES, 'UTF-8');
}

$nome      = clean($_POST['nome']      ?? '');
$cognome   = clean($_POST['cognome']   ?? '');
$email     = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$telefono  = clean($_POST['telefono']  ?? '');
$messaggio = clean($_POST['messaggio'] ?? '');

/* ── Validazione ── */
$errors = [];
if ($nome === '')                              $errors[] = 'Il nome è obbligatorio.';
if ($cognome === '')                           $errors[] = 'Il cognome è obbligatorio.';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Email non valida.';
if (mb_strlen($messaggio) < 10)               $errors[] = 'Il messaggio è troppo corto.';

if ($errors) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'msg' => implode(' ', $errors)]);
    exit;
}

/* ── Anti-spam basilare: honeypot ── */
if (!empty($_POST['website'])) {          /* campo nascosto, i bot lo riempiono */
    http_response_code(200);
    echo json_encode(['ok' => true]);     /* risposta falsa per non rivelare nulla */
    exit;
}

/* ── Costruzione email ── */
$destinatario = 'info@bigdance.it';
$oggetto      = '=?UTF-8?B?' . base64_encode("Nuovo messaggio dal sito – $nome $cognome") . '?=';

$corpo = "Hai ricevuto un nuovo messaggio dal sito BigDance School.\n";
$corpo .= str_repeat('─', 48) . "\n\n";
$corpo .= "Nome:      $nome $cognome\n";
$corpo .= "Email:     $email\n";
if ($telefono !== '') {
    $corpo .= "Telefono:  $telefono\n";
}
$corpo .= "\nMessaggio:\n$messaggio\n";
$corpo .= "\n" . str_repeat('─', 48) . "\n";
$corpo .= "Inviato il: " . date('d/m/Y H:i') . "\n";

$headers  = "From: Sito BigDance <noreply@bigdance.it>\r\n";
$headers .= "Reply-To: $nome $cognome <$email>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: 8bit\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

/* ── Invio ── */
$inviato = mail($destinatario, $oggetto, $corpo, $headers);

if ($inviato) {
    echo json_encode(['ok' => true, 'msg' => 'Messaggio inviato con successo!']);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'msg' => 'Invio fallito. Riprova o contattaci telefonicamente.']);
}
