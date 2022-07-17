const mongoose = require("mongoose");
const { Schema } = mongoose;
const nuts = ["calories", "carbs", "sugar", "protein", "fat", "saturated"];

const dietSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  breakfast: {
    description: {
      type: String,
    },
    foods: [
      {
        name: String,
        calories: Number,
        carbs: Number,
        sugar: Number,
        protein: Number,
        fat: Number,
        saturated: Number,
        amount: Number,
        serving: String,
      },
    ],
  },
  lunch: {
    description: {
      type: String,
    },
    foods: [
      {
        name: String,
        calories: Number,
        carbs: Number,
        sugar: Number,
        protein: Number,
        fat: Number,
        saturated: Number,
        amount: Number,
        serving: String,
      },
    ],
  },
  dinner: {
    description: {
      type: String,
    },
    foods: [
      {
        name: String,
        calories: Number,
        carbs: Number,
        sugar: Number,
        protein: Number,
        fat: Number,
        saturated: Number,
        amount: Number,
        serving: String,
      },
    ],
  },
  snack: {
    description: {
      type: String,
    },
    foods: [
      {
        name: String,
        calories: Number,
        carbs: Number,
        sugar: Number,
        protein: Number,
        fat: Number,
        saturated: Number,
        amount: Number,
        serving: String,
      },
    ],
  },
  date: {
    type: Date,
    required: true,
    unique: true,
  },
});

dietSchema.virtual("todayInfo").get(function () {
  let [calories, carbs, protein, fat, sugar, saturated] = [0, 0, 0, 0, 0, 0];
  const times = ["breakfast", "lunch", "dinner", "snack"];
  for (let time of times) {
    calories += this.getTimeNuts(time).calories;
    carbs += this.getTimeNuts(time).carbs;
    sugar += this.getTimeNuts(time).sugar;
    protein += this.getTimeNuts(time).protein;
    fat += this.getTimeNuts(time).fat;
    saturated += this.getTimeNuts(time).saturated;
  }
  calories = Math.round(calories * 100) / 100;
  carbs = Math.round(carbs * 100) / 100;
  sugar = Math.round(sugar * 100) / 100;
  protein = Math.round(protein * 100) / 100;
  fat = Math.round(fat * 100) / 100;
  saturated = Math.round(saturated * 100) / 100;
  return { calories, carbs, protein, fat, sugar, saturated };
});

dietSchema.methods.getTimeNuts = function (time) {
  let [calories, carbs, protein, fat, sugar, saturated] = [0, 0, 0, 0, 0, 0];
  for (let food of this[time].foods) {
    calories += food.calories;
    carbs += food.carbs;
    sugar += food.sugar;
    protein += food.protein;
    fat += food.fat;
    saturated = food.saturated;
  }
  calories = Math.round(calories * 100) / 100;
  carbs = Math.round(carbs * 100) / 100;
  sugar = Math.round(sugar * 100) / 100;
  protein = Math.round(protein * 100) / 100;
  fat = Math.round(fat * 100) / 100;
  saturated = Math.round(saturated * 100) / 100;
  return { calories, carbs, protein, fat, sugar, saturated };
};

module.exports = mongoose.model("Diet", dietSchema);
