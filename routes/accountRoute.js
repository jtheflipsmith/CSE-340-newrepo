// Needed Rsources
const express = require("express") // import express
const router = new express.Router() // create an express router
const utilities = require("../utilities/index") // import utilities module
const regValidate = require("../utilities/account-validation") // import account validation module
const accController = require("../controllers/accountController")// import account controller


// Route to default view
router.get("/", utilities.checkLogin, utilities.handleErrors(accController.buildManagement))

// Route to login view
router.get("/login", utilities.handleErrors(accController.buildLogin));

// Route to registration view
router.get("/register", utilities.handleErrors(accController.buildRegistration));

//Route to Account Management view
router.get("/management", utilities.handleErrors(accController.buildManagement))


router.get("/info", utilities.handleErrors(accController.buildInfo))

router.get("/admin", utilities.handleErrors(accController.buildAdmin))

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
    utilities.handleErrors(accController.accountLogin),
)

router.post(
    "/logout",
    utilities.handleErrors(accController.accountLogout)
)

// Route to process management
router.post(
    "/management",
    utilities.handleErrors(accController.buildManagement)
)


// Route to process account info updates (edit form submission)
router.post(
  "/info",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accController.updateAccountInfo)
)

router.post(
  "/info",
  utilities.checkLogin,
  utilities.handleErrors(accController.updateAccountPassword)
)

router.post(
  "/admin",
  regValidate.checkAdmin,
  utilities.handleErrors(accController.updateAccountType)
)

module.exports = router;
