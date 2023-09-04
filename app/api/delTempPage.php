<?php
session_start();
if ($_SESSION["auth"] != true) {
    header("HTTP/1.0 403 Forbidden");
    die;
}
$remove = "../../erwrtwehgeegegs_dsfsdf.html";

if (!file_exists($remove)) {
    header("HTTP/1.0 400 Bad Request");
} else {
    unlink($remove);
}

