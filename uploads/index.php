<?php
header('Access-Control-Allow-Origin: *');

$errors = array();
$success = false;
$url = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
	$targetDir = '';
	$targetFile = $targetDir . time() . '-' . basename($_FILES["file"]["name"]);
	$imageFileType = pathinfo($targetFile, PATHINFO_EXTENSION);
	$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";

	if (!empty($_FILES["file"]["tmp_name"])) {
		if (getimagesize($_FILES["file"]["tmp_name"])) {
			if (preg_match('/jpe?g|png|gif/', $imageFileType)) {
				if (move_uploaded_file($_FILES["file"]["tmp_name"], $targetFile)) {
			        $url = $protocol . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'] . $targetFile;
			        $success = true;
			    } else {
			        array_push($errors, 'Sorry, some error occured while uploading file');
			    }
			} else {
				array_push($errors, 'File has no image file extension');
			}
		} else {
			array_push($errors, 'File empty');
		}
	} else {
		array_push($errors, 'File empty');
	}
} else {
	array_push($errors, 'Unallowed method type');
}

header('Content-Type: application/json');
echo json_encode(compact('errors', 'url', 'success'));