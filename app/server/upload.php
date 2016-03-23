<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
$upload_dir = '../images/';
$request = $_POST["data"];
$t=time();
$img = str_replace('data:image/jpeg;base64,', '', $request);
$img = str_replace(' ', '+', $img);
$data = base64_decode($img);
$file = $upload_dir."$t.jpeg";
$success = file_put_contents($file, $data);
echo("$t.jpeg");
?>
