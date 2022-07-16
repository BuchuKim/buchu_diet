const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const foodController = require("../controllers/food");
const catchAsync = require("../utils/catchAsync");

router.get("/", catchAsync(foodController.renderFood));
router.post("/", foodController.searchFood);

router.get("/search/:foodname", foodController.searchedFood);

router.get("/new", foodController.renderNewForm);
router.post(
  "/new",
  upload.single(),
  foodController.validateFood,
  catchAsync(foodController.createFood)
);

router.get("/:id/edit", catchAsync(foodController.renderEditForm));

router.post(
  "/:id/anotherserving",
  catchAsync(foodController.getAnotherServing)
);

router.get("/:id", catchAsync(foodController.showFood));
router.put(
  "/:id",
  upload.single(),
  foodController.validateFood,
  catchAsync(foodController.updateFood)
);

module.exports = router;
