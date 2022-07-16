const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../utils/middlewares");
const catchAsync = require("../utils/catchAsync");
const dietController = require("../controllers/diet");

router.get("/", isLoggedIn, catchAsync(dietController.renderTodayDiet));

// add food
router.get("/add/:time", isLoggedIn, dietController.setTime);
router.get("/addfood", isLoggedIn, catchAsync(dietController.addFood));

router.get(
  "/:time/show/:fname",
  isLoggedIn,
  catchAsync(dietController.showDiet)
);
router.put("/:time/:fname", isLoggedIn, catchAsync(dietController.updateDiet));
router.delete(
  "/:time/:fname",
  isLoggedIn,
  catchAsync(dietController.deleteDiet)
);

module.exports = router;
