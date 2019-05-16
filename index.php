<?php

session_start();

define("VERSION", "2019-05-16-2");

if (isset($_GET["action"])) {

    require "server" . DIRECTORY_SEPARATOR . $_GET["action"] . ".php";

    exit;
}

ob_start();

require "index.html";

$content = ob_get_clean();

$replaceTag = function ($tag, $value) use (&$content) {

    $content = preg_replace("/\{\{" . $tag . "}\}/", $value, $content);
};

$removeDev = function () use (&$content) {

    $content = preg_replace("#\n*\s*(?<=<!--dev-->).*?(?=<!--/dev-->)#s", "", $content);
    $content = preg_replace("#(\n*\s*<!--dev-->)#s", "", $content);
    $content = preg_replace("#(<!--/dev-->\s*)\s*\n#s", "\n\n", $content);
};

$useProd = function () use (&$content) {

    $content = preg_replace_callback("#(?<=<!--prod-->).*?(?=<!--/prod-->)#s", function ($matches) {
        return preg_replace("#<!--|-->#", "", $matches[0]);
    }, $content);
    $content = preg_replace("#(\n*\s*<!--prod-->)#s", "", $content);
    $content = preg_replace("#(<!--/prod-->\s*)\s*\n#s", "\n\n", $content);
};

if (isset($_SESSION["old_input"])) {

    $replaceTag("NAME", $_SESSION["old_input"]["name"] ?? "");
    $replaceTag("EMAIL", $_SESSION["old_input"]["email"] ?? "");
    $replaceTag("MSG", $_SESSION["old_input"]["msg"] ?? "");
}

if (isset($_SESSION["validationErrors"])) {

    $replaceTag("NAME_ERR", $_SESSION["validationErrors"]["name"] ?? "");
    $replaceTag("EMAIL_ERR", $_SESSION["validationErrors"]["email"] ?? "");
    $replaceTag("MSG_ERR", $_SESSION["validationErrors"]["msg"] ?? "");
}

if (isset($_SESSION["ok"])) {

    if ($_SESSION["ok"]) {

        $replaceTag("FORM_OK_MSG", "contact__form-send-ok--active");

    } else if (!isset($_SESSION["validationErrors"]) || !count($_SESSION["validationErrors"])) {

        $replaceTag("FORM_ERR_MSG", "contact__form-send-error--active");
    }
}

$replaceTag("VERSION", VERSION);

$replaceTag("[^{}]+", "");

if (isset($_ENV["ENV"]) && $_ENV["ENV"] === "production") {

    $removeDev();
    $useProd();
}

unset($_SESSION["ok"]);
unset($_SESSION["old_input"]);
unset($_SESSION["validationErrors"]);
//exit;
echo $content;

exit;
