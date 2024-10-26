var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const basicAuth = require("express-basic-auth");
const cors = require("cors");

// swagger setup
var swaggerJsdoc = require("swagger-jsdoc");
var swaggerUi = require("swagger-ui-express");
const swaggerOptions = require("./config/swagger-config");
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// regist the routes
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var restuarantRouter = require("./routes/reservation");
var menu = require("./resources/menu");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Add headers
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

app.use(cors("{origin: true}"));

app.use(
  basicAuth({
    users: { admin: "adminadmin;" },
    challenge: true,
    unauthorizedResponse: getUnauthorizedResponse,
  })
);

function getUnauthorizedResponse(req) {
  return req.auth
    ? "Credentials " + req.auth.user + ":" + req.auth.password + " rejected"
    : "No credentials provided";
}

app.options("*", cors({ origin: true }));

// swagger setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// built-in middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// middleware for routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/reservation", restuarantRouter);
app.use("/menu",menu);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
