<?php

session_start();

if (isset($_GET["action"])) {

    require "server" . DIRECTORY_SEPARATOR . $_GET["action"] . ".php";

    exit;
}

ob_start();

require "index.html";

$content = ob_get_clean();

$replace = function ($tag, $value) use (&$content) {

    $content = preg_replace("/\{\{" . $tag . "}\}/", $value, $content);
};

if (isset($_SESSION["old_input"])) {

    $replace("NAME", $_SESSION["old_input"]["name"] ?? "");
    $replace("EMAIL", $_SESSION["old_input"]["email"] ?? "");
    $replace("MSG", $_SESSION["old_input"]["msg"] ?? "");
}

if (isset($_SESSION["validationErrors"])) {

    $replace("NAME_ERR", $_SESSION["validationErrors"]["name"] ?? "");
    $replace("EMAIL_ERR", $_SESSION["validationErrors"]["email"] ?? "");
    $replace("MSG_ERR", $_SESSION["validationErrors"]["msg"] ?? "");
}

if (isset($_SESSION["ok"])) {

    if ($_SESSION["ok"]) {

        $replace("FORM_OK_MSG", "contact__form-send-ok--active");

    } else if (!isset($_SESSION["validationErrors"]) || !count($_SESSION["validationErrors"])) {

        $replace("FORM_ERR_MSG", "contact__form-send-error--active");
    }
}

$replace("[^{}]+", "");

echo $content;

exit;
