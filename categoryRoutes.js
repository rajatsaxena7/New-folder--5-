const express = require("express");
const router = express.Router();
const categoryController = require("./categoryController"); // Correct import
const { upload } = require("./categoryController"); // Ensure upload is imported

// Define Routes
router.get("/search", categoryController.searchByL2Category);
router.get("/all", categoryController.getAllCategories);
router.get("/process-excel", categoryController.processExcelFromURL);

module.exports = router;
