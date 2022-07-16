const mongoose = require("mongoose");
const { Schema } = mongoose;

const foodSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  carbs: {
    type: Number,
    required: true,
  },
  sugar: { type: Number, default: 0 },
  protein: {
    type: Number,
    required: true,
  },
  fat: {
    type: Number,
    required: true,
  },
  saturated: { type: Number, default: 0 },
  serving: {
    type: String,
    enum: ["g", "개", "회"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: String,
});

foodSchema.methods.getNuts = function (amount) {
  let [calories, carbs, protein, fat] = [0, 0, 0, 0];
  if (this.serving === "개" || this.serving === "회") {
    calories = Math.round(this.calories * amount * 100) / 100;
    carbs = Math.round(this.carbs * amount * 100) / 100;
    sugar = Math.round(this.sugar * amount * 100) / 100;
    protein = Math.round(this.protein * amount * 100) / 100;
    fat = Math.round(this.fat * amount * 100) / 100;
    saturated = Math.round(this.saturated * amount * 100) / 100;
  } else {
    calories = Math.round(this.calories * amount) / 100;
    carbs = Math.round(this.carbs * amount) / 100;
    sugar = Math.round(this.sugar * amount) / 100;
    protein = Math.round(this.protein * amount) / 100;
    fat = Math.round(this.fat * amount) / 100;
    saturated = Math.round(this.saturated * amount) / 100;
  }
  return { calories, carbs, sugar, protein, fat, saturated };
};

module.exports = mongoose.model("Food", foodSchema);
