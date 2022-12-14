const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const hbs = require("express-handlebars");
const Swal = require('sweetalert2')
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const dbconnection = require("./config/connection");

const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");

const app = express();
const session = require("express-session");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.engine(
  "hbs",
  hbs.engine({
    helpers: {
      inc: function (value, options) {
        return parseInt(value) + 1;
      },
      total: function (amount, quantity) {
        return amount * quantity;
      },
      singleTotal: function (amount, discount) {
        return parseInt(amount - discount);
      },
      formatString(date) {
        newdate = date.toUTCString()
        return newdate.slice(0, 26)
      }
    },
    extname: "hbs",
    defaultLayout: "user-layout",
    layoutsDir: __dirname + "/views/layout/",
    partialsDir: __dirname + "/views/partials/",
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "Key",
    cookie: { maxAge: 60000 * 20 },
    resave: true,
    saveUninitialized: true,
  })
);
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});
app.use("/", userRouter);
app.use("/admin", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("user/error");
});

module.exports = app;


