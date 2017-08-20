<?php

$formSubmitName = $_POST["form-submit"];

if ($formSubmitName) {

    $requestClassName = "{$formSubmitName}Request";

    include "{$requestClassName}.php";

    new $requestClassName;

    exit;
}

header("Location: {$_SERVER["HTTP_REFERER"]}");

exit;
