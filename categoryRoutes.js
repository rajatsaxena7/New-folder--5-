const express = require("express");
const router = express.Router();
const categoryController = require("./categoryController"); // Correct import

// Define Routes
router.get("/search", categoryController.searchByL2Category);
router.get("/all", categoryController.getAllCategories);

module.exports = router;
