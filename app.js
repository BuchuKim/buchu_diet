const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const session = require("express-session");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");
const User = require("./models/user");
const ExpressError = require("./utils/expressError");
require("dotenv").config();

const userRoutes = require("./routes/users");
const foodRoutes = require("./routes/foods");
const dietRoutes = require("./routes/diets");

const port = 3000;

// Basic Setting
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

// session
const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    // default thesedays
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

app.use(flash());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("식단관리 DB에 연결되었습니다!");
  })
  .catch((err) => {
    console.log("DB 연결중 문제가 발생했습니다...");
    console.log(err);
  });

// res.locals : 이 한번의 lifecycle에서 전역변수로 이용 가능
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

app.get("/guide", (req, res) => {
  res.render("guide");
});
app.use("/user", userRoutes);
app.use("/food", foodRoutes);
app.use("/", dietRoutes);

app.all("*", (req, res, next) => {
  next(new ExpressError("page not found..TT", 404));
});

// error 받는 마지막 middleware
app.use((err, req, res, next) => {
  if (!err.message) err.message = "something went wrong..";
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).render("error", { err });
});

app.listen(port, () => {
  console.log(`식단관리 프로젝트가 ${port}번 포트에서 시작합니다.`);
});
