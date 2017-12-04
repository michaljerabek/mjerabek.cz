<?php

class ContactFormSubmitted {

    protected $to = "mjerabek@seznam.cz";
    protected $subject = "Zpráva z webu mjerabek.cz: {{name}} {{email}}";

    protected $errors = [];

    public function __construct() {

        $this->validate();
    }

    protected function validate() {

        $this->validateName();
        $this->validateEmail();
        $this->validateMessage();
    }

    protected function validateName() {

        if (!$_POST["name"]) {

            $this->errors["name"] = "form__item--error-required";

            return false;
        }

        return true;
    }

    protected function validateEmail() {

        if (!$_POST["email"]) {

            $this->errors["email"] = "form__item--error-required";

            return false;
        }

        if (!filter_var(filter_var($_POST["email"], FILTER_SANITIZE_EMAIL), FILTER_VALIDATE_EMAIL)) {

            $this->errors["email"] = "form__item--error-type";

            return false;
        }

        return true;
    }

    protected function validateMessage() {

        if (!$_POST["msg"]) {

            $this->errors["msg"] = "form__item--error-required";

            return false;
        }

        return true;
    }

    public function isValid() {

        return count($this->errors) === 0;
    }

    public function getErrors() {

        return $this->errors;
    }

    public function sendEmail() {

        $headers[] = "Content-type: text/html; charset=utf-8";
        $headers[] = "From: {$_POST["name"]} <{$_POST["email"]}>";

        $subject = str_replace("{{name}}", $_POST["name"], $this->subject);
        $subject = str_replace("{{email}}", $_POST["email"], $subject);

        return @mail($this->to, $subject, nl2br($_POST["msg"]), implode("\r\n", $headers));
    }
}
