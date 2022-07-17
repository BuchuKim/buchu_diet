const Joi = require("joi");

module.exports.userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  name: Joi.string().min(2).max(10).required(),
  sex: Joi.string().valid("female", "male", "none").required(),
  height: Joi.number().min(50).max(250).required(),
  weight: Joi.number().min(10).max(200).required(),
  birth: Joi.string().pattern(
    new RegExp(/^\d{4}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])$/)
  ),
  activity: Joi.string().valid("none", "light", "moderate", "high").required(),
  bodyfat: Joi.number().min(1).max(100).allow(""),
  resolution: Joi.string(),
});
module.exports.userEditSchema = Joi.object({
  sex: Joi.string().valid("female", "male", "none").required(),
  height: Joi.number().min(50).max(250).required(),
  weight: Joi.number().min(10).max(200).required(),
  birth: Joi.string().pattern(
    new RegExp(/^\d{4}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])$/)
  ),
  activity: Joi.string().valid("none", "light", "moderate", "high").required(),
  bodyfat: Joi.number().min(1).max(100).allow(""),
  resolution: Joi.string(),
});
module.exports.foodSchema = Joi.object({
  name: Joi.string().min(1).max(30).required(),
  calories: Joi.number().min(0).max(10000).required(),
  carbs: Joi.number().min(0).max(10000).required(),
  sugar: Joi.number().min(0).max(Joi.ref("carbs")).allow("", null),
  protein: Joi.number().min(0).max(10000).required(),
  fat: Joi.number().min(0).max(10000).required(),
  saturated: Joi.number().min(0).max(Joi.ref("fat")).allow("", null),
  serving: Joi.string().valid("g", "개", "회").required(),
  amount: Joi.string().min(1),
  description: Joi.string().max(2000),
});
