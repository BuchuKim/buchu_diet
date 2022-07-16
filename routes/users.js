const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/user");
const { isLoggedIn } = require("../utils/middlewares");
const catchAsync = require("../utils/catchAsync");

router.get("/profile", isLoggedIn, userController.renderProfile);

router.get("/login", userController.renderLogin);
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/user/login",
    failureFlash: "아이디 혹은 비밀번호가 틀렸습니다.",
  }),
  userController.successLogin
);
router.get("/logout", isLoggedIn, catchAsync(userController.logout));

router.get("/register", userController.renderRegisterForm);
router.post(
  "/register",
  userController.validateUser,
  catchAsync(userController.register)
);

router.get("/:id/edit", isLoggedIn, userController.renderEditForm);
router.put(
  "/:id/edit",
  isLoggedIn,
  userController.validateEditUser,
  userController.editUser
);

module.exports = router;
