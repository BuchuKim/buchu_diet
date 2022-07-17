const mongoose = require("mongoose");
const { Schema } = mongoose;

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
    calories += Math.round(this.getTimeNuts(time).calories * 100) / 100;
    carbs += Math.round(this.getTimeNuts(time).carbs * 100) / 100;
    sugar += Math.round(this.getTimeNuts(time).sugar * 100) / 100;
    protein += Math.round(this.getTimeNuts(time).protein * 100) / 100;
    fat += Math.round(this.getTimeNuts(time).fat * 100) / 100;
    saturated += Math.round(this.getTimeNuts(time).saturated * 100) / 100;
  }
  return { calories, carbs, protein, fat, sugar, saturated };
});

dietSchema.methods.getTimeNuts = function (time) {
  let [calories, carbs, protein, fat, sugar, saturated] = [0, 0, 0, 0, 0, 0];
  for (let food of this[time].foods) {
    calories += Math.round(food.calories * 100) / 100;
    carbs += Math.round(food.carbs * 100) / 100;
    sugar += Math.round(food.sugar * 100) / 100;
    protein += Math.round(food.protein * 100) / 100;
    fat += Math.round(food.fat * 100) / 100;
    saturated = Math.round(food.saturated * 100) / 100;
  }
  return { calories, carbs, protein, fat, sugar, saturated };
};

module.exports = mongoose.model("Diet", dietSchema);
