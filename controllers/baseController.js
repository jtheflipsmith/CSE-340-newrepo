const utilities = require("../utilities");
const baseController = {};

baseController.buildHome = async function(req, res) {
    const nav = await utilities.getNave()
    res.render("index",{title: "Home", nav})
};

mobile.exports = baseController;