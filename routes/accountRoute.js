// Needed Rsources
const express = require("express") // import express
const router = new express.Router() // create an express router
const utilities = require("../utilities/index") // import utilities module
const regValidate = require("../utilities/account-validation") // import account validation module
const accController = require("../controllers/accountController")// import account controller

router.get("/", utilities.checkLogin, utilities.handleErrors(accController.buildManagement))

// Route to login view
router.get("/login", utilities.handleErrors(accController.buildLogin));

// Route to registration view
router.get("/register", utilities.handleErrors(accController.buildRegistration));

// Route to process registration data
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accController.registerAccount));

// Process the login attempt
router.post( 
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accController.accountLogin)
)

module.exports = router;
