<?php

include "ContactFormSubmitted.php";

class ContactFormSubmittedRequest {

    protected $errors = null;

    protected $formSubmit;

    public function __construct() {

        $this->formSubmit = new ContactFormSubmitted;

        if ($this->formSubmit->isValid() && $this->formSubmit->sendEmail()) {

            $this->sendOk();

        } else {

            $this->sendError(
                $this->formSubmit->getErrors()
            );
        }
    }

    protected function sendOk() {

        if (isset($_POST["ajax"])) {

            header("Content-Type: application/json");

            echo json_encode([
                "ok" => true,
                "errors" => null
            ]);

            return;
        }

        header("Location: {$_SERVER["HTTP_REFERER"]}#kontakt");
    }

    protected function sendError($errors = null) {

        if (isset($_POST["ajax"])) {

            header("Content-Type: application/json");

            echo json_encode([
                "ok" => false,
                "errors" => $errors
            ]);

            return;
        }

        header("Location: {$_SERVER["HTTP_REFERER"]}#kontakt");
    }
}
