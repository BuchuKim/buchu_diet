module.exports = (user, info) => {
  const calories = isGood(user.recommended.calories, info.calories);
  const carbs = isGood(user.recommended.carbs, info.carbs);
  const sugar = isGoodSugar(user.recommended.sugar, info.sugar);
  const protein = isGood(user.recommended.protein, info.protein);
  const fat = isGood(user.recommended.fat, info.fat);
  const saturated = isGoodSugar(user.recommended.saturated, info.saturated);
  return { calories, carbs, sugar, protein, fat, saturated };
};

const isGood = (recommended, ate) => {
  const ratio = ate / recommended;
  if (ratio < 0.2) {
    return 0;
  } else if (ratio < 0.5) {
    return 1;
  } else if (ratio < 0.7) {
    return 2;
  } else if (ratio < 0.9) {
    return 3;
  } else if (ratio < 1.2) {
    return 4;
  } else {
    return 5;
  }
};
const isGoodSugar = (recommended, ate) => {
  if (ate <= recommended) {
    return 3;
  } else {
    return 5;
  }
};
