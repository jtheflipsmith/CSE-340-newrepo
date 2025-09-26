// Require utilities
const utilities = require("../utilities/index.js")
// Require account model
const accountModel = require("../models/management-model.js")

/* *************************************
* Deliver the management view
* ************************************ */
async function buildManagement(req, res, next) {
    let nav = await utilities.getNav() // get the nav HTML snippet
    res.render("inventory/management", {
        title: "Management",
        nav,
    })
}

/* *************************************
* Deliver the add classification view
* ************************************ */
async function buildClassification(req, res, next) {
    let nav = await utilities.getNav() // get the nav HTML snippet
    res.render("inventory/add-classification", {
        title: "Classification",
        nav,
    })
}

/* *************************************
* Deliver the add inventory view
* ************************************ */
async function buildInventory(req, res, next) {
    let nav = await utilities.getNav() // get the nav HTML snippet
    res.render("inventory/add-inventory", {
        title: "Inventory",
        nav,
    })
}

module.exports(buildManagement, buildClassification, buildInventory)