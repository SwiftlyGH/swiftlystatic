<?php
    ini_set('display_errors', 0);

    // Set appropriate CORS headers
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    header("Allow: GET, POST, OPTIONS, PUT, DELETE");

header('Content-type: image/svg+xml');

if (!isset($_GET['icon'])) {
    $svgPath = 'https://raw.githubusercontent.com/pico190/swiftlystatic/main/airacloud/ionicons/help-circle-outline.svg';
    echo file_get_contents($svgPath);
    die();
}

$icon = $_GET['icon'];
$svgPath = 'https://raw.githubusercontent.com/pico190/swiftlystatic/main/airacloud/intellisense/'.$icon.'.svg';
$svgContent = file_get_contents($svgPath);
echo $svgContent;
