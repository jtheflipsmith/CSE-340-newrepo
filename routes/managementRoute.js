// Needed Rsources
const express = require("express") // import express
const router = new express.Router() // create an express router
const utilities = require("../utilities/index") // import utilities module
const manageValidate = require("../utilities/management-validation") // import management validation module
const manageController = require("../controllers/managementController") // import controller into file

// Add route to management view
router.get("/management", utilities.handleErrors(manageController.buildManagement))

module.exports = router;