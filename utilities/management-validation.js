const utilities = require(".")
const { body, validationResult } = require("express-validator");
const validate = {};
const accountModel = require("../models/account-model")

validate.registrationRules = () => {
    return [
        // firstname is required and must be string
        body("classification_name") // check the "account_firstname" field
            .trim() // trim leading/trailing white space
            .escape() // escape HTML characters
            .notEmpty() // cannot be empty
            .isLength({ min: 1 }) // must be at least 1 character long
            .withMessage("Please provide a classification name."), // on error, this message will be returned
    ]
}