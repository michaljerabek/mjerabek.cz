<?php

if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    header("Location: " . $_SERVER["PHP_SELF"]);

    exit;
}

$formSubmitName = $_POST["form-submit"];

if ($formSubmitName) {

    $requestClassName = "{$formSubmitName}Request";

    include "{$requestClassName}.php";

    new $requestClassName;

    exit;
}

header("Location: " . $_SERVER["PHP_SELF"]);

exit;
