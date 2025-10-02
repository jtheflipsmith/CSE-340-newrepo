const utilities = require(".")
const { body, validationResult } = require("express-validator");
const validate = {};
const accountModel = require("../models/account-model")


/* *************************************
* Login Data Validation Rules
* *************************************/
validate.loginRules = () => {
    return [
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 1})
            .withMessage("Please provide a correct email"),
        
        body("account_password")
            .trim()
            .notEmpty()

    ]
}

/* *************************************
* Registration Data Validation Rules
* ************************************ */
validate.registrationRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname") // check the "account_firstname" field
            .trim() // trim leading/trailing white space
            .escape() // escape HTML characters
            .notEmpty() // cannot be empty
            .isLength({ min: 1 }) // must be at least 1 character long
            .withMessage("Please provide a first name."), // on error, this message will be returned
        
        // valid email is required and cannot already exist in the db
        body("account_email") // check the "account_email" field
            .trim() // trim leading/trailing white space
            .isEmail() // must be a valid email address format
            .normalizeEmail() // normalize the email address
            .withMessage("A valid email is required.") // on error, this message will be returned
            .custom (async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (emailExists) {
                    throw new Error ("Email already in use. Please use a different email.")
                } // if email exists, throw error
            }),
        // password is required and must be strong password
        body("account_password") // check the "account_password" field
            .trim() // trim leading/trailing white space
            .notEmpty() // cannot be empty
            .isStrongPassword({ // must be a strong password
                minLength: 12, // at least 12 characters
                minLowercase: 1, // at least 1 lowercase letter
                minUppercase: 1, // at least 1 uppercase letter
                minNumbers: 1, // at least 1 number
                minSymbols: 1 // at least 1 special character
            })
            .withMessage("password does not meet requirements.") // on error, this message will be returned
    ]
}   

validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body;
    let errors = validationResult(req);
    if(!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors: errors.array(),
            title: "login",
            nav,
            account_email
        
        })
        return;
    }
    next();
}

/* *************************************
* Check data and return errors or continue to registration
* ************************************ */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav() // get the nav HTML snippet
        res.render("account/register", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email
        })
        return;
    }
    next();
}



module.exports = validate;
            