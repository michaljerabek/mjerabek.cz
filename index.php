<?php

session_start();

define("VERSION", "2019-06-15-1");
define("LIBS_VERSION", "2019-05-25-4");
define("PROD",
    (isset($_ENV["ENV"]) && $_ENV["ENV"] === "production") ||
    ($_SERVER["HTTP_HOST"] === "localhost" && !isset($_GET["dev"]))
);
define("DEV", !PROD);

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

$removeSectionTags = function ($name) use (&$content) {

    $content = preg_replace("#(\n*\s*<!--" . $name . "-->)#s", "\n", $content);
    $content = preg_replace("#(<!--/" . $name . "-->\s*)\s*\n#s", "\n\n", $content);
};

$removeSection = function ($name) use (&$content, $removeSectionTags) {

    $content = preg_replace("#\n*\s*(?<=<!--" . $name . "-->).*?(?=<!--/" . $name . "-->)#s", "", $content);

    $removeSectionTags($name);
};

$useProd = function () use (&$content, $removeSectionTags) {

    $content = preg_replace_callback("#(?<=<!--prod-->).*?(?=<!--/prod-->)#s", function ($matches) {
        return preg_replace("#<!--|-->#", "", $matches[0]);
    }, $content);

    $removeSectionTags("prod");
    $removeSectionTags("analytics");
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
$replaceTag("LIBS_VERSION", LIBS_VERSION);

$replaceTag("ENV", PROD ? "production": "dev");

$replaceTag("[^{}]+", "");

if (PROD) {

    if (preg_match("#^/_/*#", $_SERVER["REQUEST_URI"])) {

        $removeSection("analytics");
    }

    $removeSection("dev");
    $useProd();
}

unset($_SESSION["ok"]);
unset($_SESSION["old_input"]);
unset($_SESSION["validationErrors"]);
//exit;
echo $content;

exit;
