<?php
// try {
//     ini_set('display_errors', 0);
//     header('Access-Control-Allow-Origin: *');
//     header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
//     header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
//     header("Allow: GET, POST, OPTIONS, PUT, DELETE");

//     header('Content-Type: application/json; charset=utf-8');
//     $syntax = str_replace("..", "", $_GET["syntax"]);
//     $lang = str_replace("..", "", $_GET["lang"]);

//     echo file_get_contents("../airacloud/references/$syntax/$lang.json");   
// } catch(Error $ERR) {
//     print_r($ERR);
// }

    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($_GET);
    
