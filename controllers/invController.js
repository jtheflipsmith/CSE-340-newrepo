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
  

module.exports = invCont;