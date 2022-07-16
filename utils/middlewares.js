module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "사이트 이용을 위해 로그인이 필요합니다.");
    return res.redirect("/user/login");
  }
  next();
};
