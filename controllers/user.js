const User = require("../models/user");
const ExpressError = require("../utils/expressError");
const { userSchema, userEditSchema } = require("../utils/validateSchema");

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.renderProfile = (req, res) => {
  res.render("users/show");
};

module.exports.successLogin = (req, res) => {
  req.flash("success", "어서오세요!");
  res.redirect("/");
};

module.exports.logout = async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      throw ExpressError(err, 500);
    } else {
      req.flash("success", "안녕히가세요!");
      res.redirect("/user/login");
    }
  });
};

module.exports.renderRegisterForm = (req, res) => {
  res.render("users/register");
};

module.exports.register = async (req, res, next) => {
  let { name, email, sex, birth, height, weight, activity, bodyfat } = req.body;
  birth = new Date(
    birth.slice(0, 4) + "-" + birth.slice(4, 6) + "-" + birth.slice(6)
  );
  const newUser = await User.register(
    new User({
      username: email,
      name,
      email,
      sex,
      birth,
      height,
      weight,
      activity,
      bodyfat,
    }),
    req.body.password
  );
  req.login(newUser);
  req.flash("success", "부추의 식단관리 사이트 가입을 환영합니다!");
  res.redirect("/");
};

module.exports.renderEditForm = (req, res) => {
  const date = req.user.birth;
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  res.render("users/edit", { dateStr });
};
module.exports.editUser = async (req, res, next) => {
  let { sex, birth, height, weight, activity, bodyfat } = req.body;
  birth = new Date(
    birth.slice(0, 4) + "-" + birth.slice(4, 6) + "-" + birth.slice(6)
  );
  await User.findByIdAndUpdate(req.user._id, {
    sex,
    birth,
    height,
    weight,
    activity,
    bodyfat,
  });
  req.flash("success", "정보 수정 완료!");
  res.redirect("/user/profile");
};

module.exports.validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    const message = error.details.map((el) => el.message).join(",");
    throw new ExpressError(message, 400);
  } else {
    next();
  }
};
module.exports.validateEditUser = (req, res, next) => {
  req.body.bodyfat === "" ? delete req.body.bodyfat : null;
  const { error } = userEditSchema.validate(req.body);
  if (error) {
    const message = error.details.map((el) => el.message).join(",");
    throw new ExpressError(message, 400);
  } else {
    next();
  }
};
