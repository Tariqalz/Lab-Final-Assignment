<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}
// check the HTTP request method
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    header('Allow: POST');
    http_response_code(405);
    echo json_encode('Method Not Allowed');
    return;
}
//set HTTP responce


include_once '../db/Database.php';
include_once '../models/Bookmark.php';

// Instantiate Database object and connect
$database = new Database();
$dbConnection = $database->connect();
// Instantiate a book mark object
$bookmark = new Bookmark($dbConnection);
// get the HTTP POST request JSON body
$data = json_decode(file_get_contents("php://input"), true);
if(!$data || !isset($data['title']) || !isset($data['link'])){
    http_response_code(422);
    echo json_encode(
        array('message' => 'Error: Missing required parameter title and link in the JSON body.')
    );
    return;
}

$bookmark->setTitle($data['title']);
$bookmark->setLink($data['link']);
// create
if ($bookmark->create()) {
    echo json_encode(
        array('message' => 'A Bookmark item was created')
    );
} else {
    echo json_encode(
        array('message' => 'Error: a Bookmark item was Not created')
    );
}
