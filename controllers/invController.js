const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}
const errorCont = {}
/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  req.flash("notice", "Flash message")
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryById(inv_id)
  const detail = await utilities.buildInventoryDetail(data[0])
  let nav = await utilities.getNav()
  const invMake = data[0].inv_make
  const invModelName = data[0].inv_model
  res.render("./inventory/inventory-detail", {
    title: invMake + " " + invModelName,
    nav,
    detail,
  })
}



// intentional 500 error controller for testing
invCont.buildThrowError = async function (req, res, next) {
  try {
    const error = new Error("A 500 error has occurred")
    error.status = 500
    throw error
  } catch (err) {
    next(err)
  } }
  


/* *************************************
* Deliver the management view
* ************************************ */
invCont.buildManagement = async function (req, res, next) {
    let nav = await utilities.getNav() // get the nav HTML snippet
    res.render("inventory/management", {
        title: "Management",
        nav,
        errors: null
    })
}

/* *************************************
* Deliver the add classification view
* ************************************ */
invCont.buildClassification = async function (req, res, next) {
    let nav = await utilities.getNav() // get the nav HTML snippet
    res.render("inventory/add-classification", {
        title: "Add Classification",
        nav,
    })
}

/* *************************************
* Deliver the add inventory view
* ************************************ */
invCont.buildInventory = async function (req, res, next) {
    try {
        let nav = await utilities.getNav(); // Get the nav HTML snippet
        let classificationList = await utilities.buildClassificationList(); // Generate the classification dropdown
        res.render("inventory/add-inventory", {
            title: "Add Inventory",
            nav,
            classificationList, // Pass the classification list to the view
        });
    } catch (error) {
        console.error("Error building inventory view:", error.message);
        next(error);
    }
};
invCont.registerClassification = async function (req, res) {
    let nav = await utilities.getNav() // get the nav HTML snippet
    const { 
        classification_name
    } = req.body

    const addClassResult = await invModel.createNewClassification(
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

invCont.registerInventory = async function (req, res) {
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
            inv_color,
            classification_id
    } = req.body

    const addInvResult = await invModel.createNewInventory(
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
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
module.exports = invCont;