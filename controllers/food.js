const Food = require("../models/food");
const ExpressError = require("../utils/expressError");
const { foodSchema } = require("../utils/validateSchema");

module.exports.renderFood = async (req, res, next) => {
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const foods = await Food.find({})
    .skip(15 * (page - 1))
    .limit(16);
  let end = false;
  if (foods.length < 16) {
    end = true;
  } else {
    foods.pop();
  }
  res.render("foods/index", { foods, page, foodname: null, end });
};

module.exports.searchFood = (req, res) => {
  res.redirect(`/food/search/${req.body.foodname}`);
};
module.exports.searchedFood = async (req, res, next) => {
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const { foodname } = req.params;
  let end = false;
  const foods = await Food.find({
    name: { $regex: foodname, $options: "i" },
  })
    .skip(15 * (page - 1))
    .limit(16);
  if (foods.length < 16) {
    end = true;
  } else {
    foods.pop();
  }
  res.render("foods/index", { foods, page, foodname, end });
};

module.exports.renderNewForm = (req, res) => {
  res.render("foods/new");
};

module.exports.createFood = async (req, res, next) => {
  const newFood = new Food({ ...req.body });
  if (newFood.serving === "g") {
    newFood.amount = 100;
  } else {
    newFood.amount = 1;
  }
  await newFood.save();
  req.flash("success", "음식을 추가했습니다!");
  res.redirect("/food");
};

module.exports.renderEditForm = async (req, res, next) => {
  const food = await Food.findById(req.params.id);
  res.render("foods/edit", { food });
};
module.exports.getAnotherServing = async (req, res, next) => {
  const food = await Food.findById(req.params.id);
  const n_nuts = food.getNuts(req.body.amount);
  food.calories = n_nuts.calories;
  food.carbs = n_nuts.carbs;
  food.sugar = n_nuts.sugar;
  food.protein = n_nuts.protein;
  food.fat = n_nuts.fat;
  food.saturated = n_nuts.saturated;
  food.amount = req.body.amount;
  req.session.anotherfood = { ...food };
  res.redirect(`/food/${food._id}`);
};

module.exports.showFood = async (req, res, next) => {
  const adding = req.session.adding;
  if (req.session.anotherfood) {
    const food = { ...req.session.anotherfood._doc };
    if (adding) {
      req.session.curFood = food;
    }
    delete req.session.anotherfood;
    res.render("foods/show", { food, adding });
  } else {
    const food = await Food.findById(req.params.id);
    if (adding) {
      req.session.curFood = food;
    }
    res.render("foods/show", { food, adding });
  }
};
module.exports.updateFood = async (req, res, next) => {
  const { id } = req.params;
  await Food.findByIdAndUpdate(id, { ...req.body });
  req.flash("success", "음식 수정을 완료했습니다!");
  res.redirect(`/food/${id}`);
};

module.exports.validateFood = (req, res, next) => {
  const { error } = foodSchema.validate(req.body);
  if (error) {
    const message = error.details.map((el) => el.message).join(",");
    throw new ExpressError(message, 400);
  } else {
    next();
  }
};
