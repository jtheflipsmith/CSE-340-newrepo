// Require utilities
const utilities = require("../utilities/index.js")
// Require account model
const accountModel = require("../models/account-model.js")
/* *************************************
* Deliver the login view
* ************************************ */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav() // get the nav HTML snippet
    res.render("account/login", {
        title: "Login",
        nav,
    })
}

/* *************************************
* Deliver the registration view
* ************************************ */
async function buildRegistration(req, res, next) {
    let nav = await utilities.getNav() // get the nav HTML snippet
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null
    })
}

/* *************************************
* Process registration
* ************************************ */
async function registerAccount(req, res) {
    let nav = await utilities.getNav() // get the nav HTML snippet
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered. ${account_firstname}. Please log in.` 
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
        })
    }
    else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Register",
            nav,
        })
    }
}
module.exports = { buildLogin, buildRegistration, registerAccount };