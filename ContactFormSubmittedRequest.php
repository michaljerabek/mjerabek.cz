<?php

include "ContactFormSubmitted.php";

class ContactFormSubmittedRequest {

    protected $formSubmit;

    public function __construct() {

        $this->formSubmit = new ContactFormSubmitted;

        if ($this->formSubmit->isValid() && $this->formSubmit->sendEmail()) {

            $this->sendOk();

        } else {

            $this->sendError(
                null,
                $this->formSubmit->getErrors()
            );
        }
    }

    protected function getResponse($ok, $errors = null, $validationErrors = null) {

        return json_encode([
            "ok" => $ok,
            "errors" => $errors ? $errors : $validationErrors,
            "validationErrors" => $validationErrors
        ]);
    }

    protected function sendOk() {

        if (isset($_POST["ajax"])) {

            header("Content-Type: application/json");

            echo $this->getResponse(true);

            return;
        }

        header("Location: {$_SERVER["HTTP_REFERER"]}#kontakt");
    }

    protected function sendError($errors, $validationErrors) {

        if (isset($_POST["ajax"])) {

            header("Content-Type: application/json");

            echo $this->getResponse(
                false,
                count($errors) ? $errors: null,
                count($validationErrors) ? $validationErrors: null
            );

            return;
        }

        header("Location: {$_SERVER["HTTP_REFERER"]}#kontakt");
    }
}
