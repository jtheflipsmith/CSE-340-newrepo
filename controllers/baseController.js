const utilities = require("../utilities");
const baseController = {};

baseController.buildHome = async function(req, res) {
    const nav = await utilities.getNav() // get the nav HTML snippet
    res.render("index",{title: "Home", nav}) // render index view
};



module.exports = baseController;