<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: /contact/');
    exit;
}

if (!empty($_POST['website'])) {
    header('Location: /thank-you/');
    exit;
}

$name           = htmlspecialchars(trim($_POST['name'] ?? ''), ENT_QUOTES, 'UTF-8');
$email          = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$phone          = htmlspecialchars(trim($_POST['phone'] ?? ''), ENT_QUOTES, 'UTF-8');
$address        = htmlspecialchars(trim($_POST['address'] ?? ''), ENT_QUOTES, 'UTF-8');
$message        = htmlspecialchars(trim($_POST['message'] ?? ''), ENT_QUOTES, 'UTF-8');
$page           = htmlspecialchars(trim($_POST['page'] ?? ''), ENT_QUOTES, 'UTF-8');
$redirect_error = filter_var(trim($_POST['_redirect_error'] ?? '/contact/?error=1'), FILTER_SANITIZE_URL);

if (empty($name) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Location: ' . $redirect_error);
    exit;
}

$to      = 'info@sevenroofing.com.au';
$subject = 'Enquiry From ' . $name;

$body  = "You have received a new enquiry from the Seven Roofing website.\n\n";
$body .= "Name: {$name}\n";
$body .= "Email: {$email}\n";
if ($phone)   $body .= "Phone: {$phone}\n";
if ($address) $body .= "Address: {$address}\n";
if ($message) $body .= "\nMessage:\n{$message}\n";
if ($page)    $body .= "\n---\nSent from: https://sevenroofing.com.au{$page}\n";

$headers  = "From: SevenRoofing <no-reply@sevenroofing.com.au>\r\n";
$headers .= "Reply-To: info@sevenroofing.com.au\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

mail($to, $subject, $body, $headers);

header('Location: /thank-you/');
exit;
