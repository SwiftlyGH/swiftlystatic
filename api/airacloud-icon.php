<?php
    ini_set('display_errors', 0);

    // Set appropriate CORS headers
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    header("Allow: GET, POST, OPTIONS, PUT, DELETE");

header('Content-type: image/svg+xml');

if (!isset($_GET['icon']) || !isset($_GET['fill'])) {
    $svgPath = '../airacloud/ionicons/help-circle-outline.svg';
    echo file_get_contents($svgPath);
    die();
}

$icon = $_GET['icon'];
$fill = $_GET['fill'];

$svgPath = '../airacloud/ionicons/'.$icon.'-outline.svg';

if (!file_exists($svgPath)) {
    $svgPath = '../airacloud/ionicons/help-circle-outline.svg';
    echo file_get_contents($svgPath);
    die();
}

$svgContent = file_get_contents($svgPath);
$svgContent = str_replace('#000', $fill, $svgContent);

echo $svgContent;
