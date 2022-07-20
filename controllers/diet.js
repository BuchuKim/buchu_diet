// controller of diets
const Diet = require("../models/diet");
const moment = require("moment-timezone");

module.exports.renderTodayDiet = async (req, res, next) => {
  const dateSeoul = moment.tz(Date.now(), "Asia/Seoul").format("YYYY-MM-DD");
  let ate = await Diet.findOne({
    user: req.user._id,
    date: dateSeoul,
  });
  if (!ate) {
    ate = new Diet({ user: req.user._id, date: dateSeoul });
    await ate.save();
  }
  res.render("diets/index", { ate });
};

module.exports.setTime = (req, res) => {
  req.session.adding = req.params.time;
  res.redirect("/food");
};
module.exports.addFood = async (req, res, next) => {
  const curFood = { ...req.session.curFood };
  const dateSeoul = moment.tz(Date.now(), "Asia/Seoul").format("YYYY-MM-DD");
  delete req.session.curFood;
  const diet = await Diet.findOne({
    user: req.user._id,
    date: dateSeoul,
  });
  const foods = [...diet[req.session.adding].foods];
  const idx = foods.findIndex(function (item) {
    return item.name === curFood.name;
  });
  if (idx > -1) {
    // 이미 식단에 음식이 존재함
    foods[idx].calories += curFood.calories;
    foods[idx].amount += curFood.amount;
    foods[idx].carbs += curFood.carbs;
    foods[idx].sugar += curFood.sugar;
    foods[idx].protein += curFood.protein;
    foods[idx].fat += curFood.fat;
    foods[idx].saturated += curFood.saturated;
  } else {
    const newFood = {
      name: curFood.name,
      calories: curFood.calories,
      carbs: curFood.carbs,
      sugar: curFood.sugar,
      protein: curFood.protein,
      fat: curFood.fat,
      saturated: curFood.saturated,
      amount: curFood.amount,
      serving: curFood.serving,
    };
    foods.push(newFood);
  }
  diet[req.session.adding].foods = foods;
  await diet.save();
  delete req.session.adding;
  delete req.session.curFood;
  res.redirect("/");
};

module.exports.showDiet = async (req, res, next) => {
  const dateSeoul = moment.tz(Date.now(), "Asia/Seoul").format("YYYY-MM-DD");
  const time = req.params.time;
  const ate = await Diet.findOne({
    user: req.user._id,
    date: dateSeoul,
  });
  const idx = ate[time].foods.findIndex(function (item) {
    return item._id.toString() === req.params.fname;
  });
  const food = ate[time].foods[idx];
  res.render("diets/show", { food, time });
};
module.exports.deleteDiet = async (req, res, next) => {
  const dateSeoul = moment.tz(Date.now(), "Asia/Seoul").format("YYYY-MM-DD");
  const time = req.params.time;
  const ate = await Diet.findOne({
    user: req.user._id,
    date: dateSeoul,
  });
  const foods = [...ate[time].foods];
  const idx = foods.findIndex(function (item) {
    return item._id.toString() === req.params.fname;
  });
  foods.splice(idx, 1);
  ate[time].foods = foods;
  await ate.save();
  res.redirect("/");
};
module.exports.updateDiet = async (req, res, next) => {
  const dateSeoul = moment.tz(Date.now(), "Asia/Seoul").format("YYYY-MM-DD");
  const time = req.params.time;
  const amount = req.body.amount;
  const ate = await Diet.findOne({
    user: req.user._id,
    date: dateSeoul,
  });
  const idx = ate[time].foods.findIndex(function (item) {
    return item._id.toString() === req.params.fname;
  });
  const food = { ...ate[time].foods[idx] }._doc;
  const coef = amount / food.amount;
  food.amount = amount;
  food.calories = Math.round(coef * food.calories * 100) / 100;
  food.carbs = Math.round(coef * food.carbs * 100) / 100;
  food.sugar = Math.round(coef * food.sugar * 100) / 100;
  food.protein = Math.round(coef * food.protein * 100) / 100;
  food.fat = Math.round(coef * food.fat * 100) / 100;
  food.saturated = Math.round(coef * food.saturated * 100) / 100;
  ate[time].foods[idx] = food;
  await ate.save();
  res.redirect(`/${time}/show/${req.params.fname}`);
};

module.exports.renderSearchDiet = (req, res) => {
  res.render("diets/search", { ate: null, inputDate: null });
};

module.exports.searchPrevDiet = async (req, res, next) => {
  const { year, month, day } = req.body;
  const inputDate = moment
    .tz(new Date(year, month - 1, day), "Asia/Seoul")
    .format("YYYY-MM-DD");
  const ate = await Diet.findOne({
    user: req.user._id,
    date: inputDate,
  });
  res.render("diets/search", { ate, inputDate });
};
