// Require utilities
const utilities = require("../utilities/index.js")
// Require account model
const managementModel = require("../models/management-model")

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

async function registerClassification(req, res) {
    let nav = await utilities.getNav() // get the nav HTML snippet
    const { 
        classification_name
    } = req.body

    const addClassResult = await managementModel.registerClassification(
        classification_name
    )


    if (addClassResult) {
        req.flash(
            "notice",
            `Congratulations, you\'ve registered. ${classification_name} into the system.` 
        )
        res.status(201).render("inventory/management", {
            title: "Management",
            nav,
        })
    }
    else {
        req.flash("notice", "Sorry, the classification was not registered.")
        res.status(501).render("inventory/add-classification", {
            title: "Management",
            nav,
        })
    }
}

async function registerInventory(req, res) {
    let nav = await utilities.getNav() // get the nav HTML snippet
    const { 
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color
    } = req.body

    const addInvResult = await managementModel.registerInventory(
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color
    )


    if (addInvResult) {
        req.flash(
            "notice",
            `Congratulations, you\'ve succesfully added inventory!` 
        )
        res.status(201).render("inventory/management", {
            title: "Management",
            nav,
        })
    }
    else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("inventory/add-inventory", {
            title: "Add inventory",
            nav,
        })
    }
}

module.exports = (
    buildManagement, 
    buildClassification, 
    buildInventory, 
    registerClassification, 
    registerInventory
)