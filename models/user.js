const mongoose = require("mongoose");
const { Schema } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  sex: {
    type: String,
    enum: ["female", "male", "none"],
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  birth: {
    type: Date,
    required: true,
  },
  activity: {
    type: String,
    enum: ["none", "light", "moderate", "high"],
    required: true,
  },
  bodyfat: Number,
  resolution: String,
});
userSchema.virtual("age").get(function () {
  var ageDifMs = Date.now() - this.birth.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
});
userSchema.virtual("BMR").get(function () {
  if (this.sex === "female") {
    return (
      Math.round(
        (655.1 + 9.56 * this.weight + 1.85 * this.height - 4.68 * this.age) *
          100
      ) / 100
    );
  } else {
    return (
      Math.round(
        (66.47 + 13.75 * this.weight + 5 * this.height + 6.76 * this.age) * 100
      ) / 100
    );
  }
});
userSchema.virtual("coef").get(function () {
  if (this.activity === "none") {
    return 1.2;
  } else if (this.activity === "light") {
    return 1.375;
  } else if (this.activity === "moderate") {
    return 1.55;
  } else {
    return 1.725;
  }
});
userSchema.virtual("recommended").get(function () {
  const calories = Math.round(this.BMR * this.coef * 10) / 10;
  const carbs = Math.round(calories * 0.075 * 10) / 10;
  const sugar = 50;
  const protein = Math.round(calories * 0.1 * 10) / 10;
  const saturated = Math.round((calories / 10 / 9) * 10) / 10;
  const fat = Math.round(((calories * 0.3) / 9) * 10) / 10;
  return { calories, carbs, protein, fat, sugar, saturated };
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
