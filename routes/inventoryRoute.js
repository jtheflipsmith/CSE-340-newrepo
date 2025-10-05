// Needed Rsources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const mValidate = require("../utilities/management-validation")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));

router.get("/error", utilities.handleErrors(invController.buildThrowError));

// Add route to management view
router.get("/", utilities.handleErrors(invController.buildManagement))

router.get("/add-classification", utilities.handleErrors(invController.buildClassification))

router.get("/add-inventory", utilities.handleErrors(invController.buildInventory))

/* **********************************************
* Get inventory for AJAX route
* Unit 5, Select inv item actively 
*********************************************** */
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

router.get("/edit/:inv_id", utilities.handleErrors(invController.deleteView));

router.get("/delete/:inv_id", utilities.handleErrors(invController.deleteView));

router.post("/delete", 
    invController.updateInventory)

router.post("/add-classification",
    mValidate.addClassificationRules(),
    mValidate.checkClassificationData,
    utilities.handleErrors(invController.registerClassification)
)

router.post("/add-inventory",
    mValidate.addInventoryRules(),
    mValidate.checkInventoryData,
    utilities.handleErrors(invController.registerInventory)
)

router.post("/update", invController.updateInventory)



module.exports = router;