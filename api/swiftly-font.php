<?php
    ini_set('display_errors', 0);

    // Set appropriate CORS headers
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    header("Allow: GET, POST, OPTIONS, PUT, DELETE");

    $url_ttf = 'https://raw.githubusercontent.com/pico190/swiftlystatic/main/swiftly/'.$_GET["request"].'.ttf';
$contenido_ttf = file_get_contents($url_ttf);

if ($contenido_ttf !== false) {
    header('Content-Type: font/ttf');
    header('Content-Disposition: attachment; filename="font.ttf"'); // Cambia el nombre del archivo si lo deseas

    echo $contenido_ttf;
}