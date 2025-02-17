const express = require("express");
const router = express.Router();
const categoryController = require("./categoryController"); // Correct import

// Define Routes
router.get("/search", categoryController.searchByL2Category);
router.get("/all", categoryController.getAllCategories);
router.get("/search-all", categoryController.searchByL2Categoryl2);

module.exports = router;
