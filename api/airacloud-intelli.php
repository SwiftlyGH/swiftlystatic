<?php
try {
    ini_set('display_errors', 0);

    // Set appropriate CORS headers
    header('Access-Control-Allow-Origin: *'); // Set the allowed origin
    header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    header("Allow: GET, POST, OPTIONS, PUT, DELETE");

    header('Content-Type: application/json; charset=utf-8');

    // Sanitize and validate inputs
    $syntax = isset($_GET["syntax"]) ? basename($_GET["syntax"]) : ""; // Assuming syntax is a file name
    $lang = isset($_GET["lang"]) ? basename($_GET["lang"]) : ""; // Assuming lang is a file name

    if($_GET["version"]=="t") {
        $filePath = "https://raw.githubusercontent.com/pico190/swiftlystatic/main/airacloud/references/version.json";
        $content = file_get_contents($filePath);
        echo $content;
        die();
    }
    // Validate syntax and lang
    if (empty($syntax) || empty($lang)) {
        throw new Exception("Syntax and lang parameters are required.");
    }

    // Construct file path
    $filePath = "https://raw.githubusercontent.com/pico190/swiftlystatic/main/airacloud/references/".$syntax."/".$lang.".json";
    $content = file_get_contents($filePath);
    if(str_contains($content, "404: Not Found")) {
        $lang = "en";
        $filePath = "https://raw.githubusercontent.com/pico190/swiftlystatic/main/airacloud/references/".$syntax."/".$lang.".json";
        $content = file_get_contents($filePath);
    }
    echo $content; 
} catch(Exception $e) {
    // Handle exceptions
    http_response_code(500);
    echo json_encode(array("Error" => $e->getMessage()));
}
