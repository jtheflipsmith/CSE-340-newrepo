// Require utilities
const utilities = require("../utilities/index.js")
// Require account model
const accountModel = require("../models/account-model.js")
// Require bcryptjs for password hashing
const bcrypt = require("bcryptjs")
const { hash } = require("bcryptjs")
// requite json webtoken and dotenv packages
const jwt = require("jsonwebtoken")
require('dotenv').config()

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
* Deliver the confirmation login view
* ************************************ */
async function buildManagement(req, res) {
    let nav = await utilities.getNav() // get the nav HTML snippet
    const accountData = res.locals.user
    res.render("account/management", {
        title: `Welcome ${accountData.account_firstname}`,
        nav,
        loginAccess: true,
        errors: null
    })
}

/* ************************************
* Build Admin view
************************************ */
async function buildAdmin(req, res, next) {
    let nav = await utilities.getNav() // get the nav HTML snippet
    res.render("account/admin", {
        title: "Admin",
        nav,
    })
}

async function buildInfo (req, res, next) {
    try {
          let nav = await utilities.getNav()
          const account_id = res.locals.user.account_id
          const itemData = await accountModel.getAccountById(account_id)

          res.render("account/info", {
            title: "Edit Account Info",
            nav,
            errors: null,
            account_firstname: itemData.account_firstname,
            account_lastname: itemData.account_lastname,
            account_email: itemData.account_email
                        ,
                        account_id: itemData.account_id
  
          })
        } catch (error) {
        console.error("Error building edit view:", error.message);
        next(error);
    }
};

/* ************************************
* Process account info update
************************************** */
async function updateAccountInfo(req, res, next) {
    let nav = await utilities.getNav()
    const { 
        
        account_firstname, 
        account_lastname, 
        account_email,
        account_id
    } = req.body
    const updatedAccount = await accountModel.editAccountInfo(
      
      account_firstname,
      account_lastname,
      account_email,
      account_id
    )

        if (!updatedAccount) {
      req.flash("notice", "Update failed. Please try again.")
      return res.status(400).render("account/info", {
        title: "Edit Account Info",
        nav,
        errors: null,
        account_firstname,
        account_lastname,
        account_email,
        account_id
      })
    }

    req.flash("notice", "Account information updated successfully!")
    return res.redirect("/account/management")
}

async function updateAccountPassword(req, res) {
    let nav = await utilities.getNav()
    const { account_password, account_id } = req.body

        // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hash(account_password, 10)
    } catch (error) {
        req.flash("notice", "Sorry, there was an error processing the new password.")
        res.status(500).render("account/infp", {
            title: "info",
            nav,
            errors: null
        })
    }

    const updatePasswordResult = await accountModel.updatePassword(account_id, hashedPassword)
    if (updatePasswordResult) {
    req.flash(
        "notice",
        `Congratulations, you\'ve updated your password.` 
    )
    res.status(201).render("account/management", {
        title: "Account Management",
        nav,
    })
    }
    else {
        req.flash("notice", "Sorry, the update failed.")
        res.status(501).render("account/info", {
            title: "Account Info",
            nav,
        })
    }

}



/* *************************************
* Process registration
* ************************************ */
async function registerAccount(req, res) {
    let nav = await utilities.getNav() // get the nav HTML snippet
    const { 
        account_firstname, 
        account_lastname, 
        account_email, 
        account_password
    } = req.body

    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hash(account_password, 10)
    } catch (error) {
        req.flash("notice", "Sorry, there was an error processing the registration.")
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null
        })
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
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

/* ************************************
* Process login request
* **************************************** */
async function accountLogin(req, res) {
    // Grab sites navigation menu
    let nav = await utilities.getNav()
    // Pull email and password from the form to use more easily
    const { account_email, account_password } = req.body
    // Checks if email is in database
    const accountData = await accountModel.getAccountByEmail(account_email)
    // If account doesn't exist, show error then rerout to login page
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })
        return
    }
    try {
        // Check if plain password matches its hashed variant 
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            // if password is correct it deletes password for security
            delete accountData.account_password
            // Creates webtoken to prove user is logged in, it expiresIn: 3600 seconds or 1 hour
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600})
            
            // Cookie is created to keep the user logged in
            if(process.env.NODE_ENV === 'development') {
                // httpOnly: true = Javascript on brouser can't read
                res.cookie("jwt", accessToken, {httpOnly: true, maxAge: 3600 * 1000})
            } else {
                //cookie is only sent over HTTPS
                res.cookie("jwt", accessToken, {httpOnly: true, secure: true, maxAge: 3600 * 1000})
            }
            // User is rerouted to their account dashbourd
            return res.redirect("/")
        }
        // If password is wrong, then reroute to login page with error message.
        else {
            req.flash("message notice", "Please check your credentials and try again")
            res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email,
            })
        }
    } catch (error) {
        throw new Error('Access Forbidden')
    }
}

/* ********************************
* Logout handler
********************************* */
async function accountLogout(req, res) {
    // Clear the JWT cookie (used for auth)
    res.clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        path: '/'
    })

    // Destroy the server-side session (if any) and clear the session cookie
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session during logout:', err)
            }
            // Clear the session cookie set by express-session (name set in server.js)
            res.clearCookie('sessionId', { path: '/' })
            return res.redirect('/')
        })
    } else {
        // No session to destroy, just clear session cookie and redirect
        res.clearCookie('sessionId', { path: '/' })
        return res.redirect('/')
    }
}


/* ***********************************
* LAST ASSIGNMENT
* Adding account change to a log in view
* *********************************** */
async function updateAccountType(req, res) {
    let nav = await utilities.getNav() 

    const { password, account_id } = req.body
    console.log("User entered password", password)
    console.log("Admin code from .env:", process.env.ADMIN_CODE)
    // verify admin code matches
    if (password == process.env.ADMIN_CODE) {
        try {
            const result = await accountModel.updateAccountType(account_id, "Admin")
            if (result) {
                req.flash("notice", "Account information updated successfully!")
                return res.redirect("/account/management")
            } else {
                req.flash("notice", "Update failed. Please try again.")
                return res.status(400).render("account/admin", {
                    title: "Edit Account Info",
                    nav,
                    errors: null
                })
            }
        } catch (error) {
            console.error('Error updating account type:', error)
            req.flash("notice", "An error occurred while updating account type.")
            return res.status(500).render("account/admin", { title: "Admin Access", nav })
        }
    } else {
        req.flash("notice", "Password not correct")
+       res.status(403).render("account/admin", { title: "Admin Access", nav });
    }


}

module.exports = { 
    buildLogin, 
    buildRegistration, 
    registerAccount, 
    accountLogin, 
    buildManagement, 
    accountLogout,
    buildInfo,
    updateAccountInfo,
    updateAccountPassword,
    buildAdmin,
    updateAccountType
 };