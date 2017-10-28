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

        return [
            "ok" => $ok,
            "errors" => $errors ? $errors : $validationErrors,
            "validationErrors" => $validationErrors
        ];
    }

    protected function responseToSession($response) {

        $_SESSION["ok"] = $response["ok"];
        $_SESSION["errors"] = $response["errors"];
        $_SESSION["validationErrors"] = $response["validationErrors"];
    }

    protected function sendOk() {

        $response = $this->getResponse(true);

        if (isset($_POST["ajax"])) {

            header("Content-Type: application/json");

            echo json_encode($response);

            return;
        }

        $this->responseToSession($response);

        header("Location: " . $_SERVER["PHP_SELF"] . "#kontakt");
    }

    protected function sendError($errors, $validationErrors) {

        $response = $this->getResponse(
            false,
            count($errors) ? $errors: null,
            count($validationErrors) ? $validationErrors: null
        );

        if (isset($_POST["ajax"])) {

            header("Content-Type: application/json");

            echo json_encode($response);

            return;
        }

        $_SESSION["old_input"] = $_POST;

        $this->responseToSession($response);

        header("Location: " . $_SERVER["PHP_SELF"] . "#kontakt");
    }
}
