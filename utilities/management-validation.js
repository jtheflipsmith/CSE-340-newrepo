const utilities = require(".") // Import utilities index file
const { body, validationResult } = require("express-validator"); 
const validate = {};


validate.addClassificationRules = () => {
    return [
        // classification name is required and must be string
        body("classification_name") // check the "account_firstname" field
            .trim() // trim leading/trailing white space
            .escape() // escape HTML characters
            .notEmpty() // cannot be empty
            .isLength({ min: 1 }) // must be at least 1 character long
            .withMessage("Please provide a classification name."), // on error, this message will be returned
    ]
}



validate.addInventoryRules = () => {
    return [
        // Check for make
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("No valid make"),

        // Sanitize model input 
        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Isn't valid model"),

        body("inv_description")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Description isn't valid"),

        body("inv_image")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("check image link"),

        body("inv_thumbnail")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Is the thumbnail clipped?"),

        body("inv_price")
            .trim()
            .isNumeric()
            .notEmpty()
            .withMessage("Check the price"), 
            
        body("inv_year")
            .trim()
            .isNumeric()
            .notEmpty()
            .withMessage("Year not accepted"),   
            
        body("inv_miles")
            .trim()
            .isNumeric()
            .notEmpty()
            .withMessage("Check the odometer"),  
            
        body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Must be color blind")

    ]
}

validate.checkClassificationData = async (req, res, next) => {
    const {classification_name} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/management", {
            errors,
            title: "Add classification",
            nav,
            classification_name
        })
        return
    }
    next()
}

validate.checkInventoryData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } =
    req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-inventory", {
            errors,
            title: "Add inventory",
            nav, 
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color
        })
        return
    }
    next()
}

module.exports = validate