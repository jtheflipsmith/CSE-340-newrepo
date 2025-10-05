/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities/")
const session = require("express-session")
const pool = require("./database/")
const accountRoute = require("./routes/accountRoute")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")


/* ***********************
 * Middleware
 *************************/

// cookie Parser statement
app.use(cookieParser())

// JWT authentication
app.use(utilities.checkJWTToken)

app.use(session({
  store: new (require('connect-pg-simple')(session))({ 
    createTableIfMissing: true, // Create the session table if it doesn't exist
    pool, // Connection pool
  }),
  secret: process.env.SESSION_SECRET, // long random string for security
  resave: true, 
  saveUninitialized: true, // create session for each visit
  name: 'sessionId', // name of the cookie to store session ID
}))

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Express Messages Middleware
app.use(require('connect-flash')()) // flash messages for express
app.use(function (req, res, next) { // custom middleware to setup flash message support
  res.locals.messages = require('express-messages')(req, res) // make flash messages available in response locals
  next() // move to next piece of middleware
})

// check authentication level
app.use(utilities.authLevel)


/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs") // set view engine for server
app.use(expressLayouts) // use express-ejs-layouts
app.set("layout", "./layouts/layout") // not at view root

/* ***********************
 * Routes
 *************************/
app.use(static) // use static routes
// Index route
app.get("/", utilities.handleErrors(baseController.buildHome)) // this is the route for the home page
// Inventory routes 
app.use("/inv", inventoryRoute)
// Account routes
app.use("/account", accountRoute)

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Ah...you look lost, simply head back home and reflect on your mistakes'})
})


/* ***********************
*Express Error Handler
*Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  let message
  let title
  if(err.status == 404){
      title = "404 Not Found"
      message = err.message || "Well, look at this mess, nothing to do but go back i guess...?"
    }
  else if (err.status == 500){
    title = "500 Server Error"
    message = err.message || "Caught us with out pants down"
  }
  else {
    title = "Error"
    message = "Well, this is embarrassing..."}
  res.status(err.status || 500)
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})



/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
