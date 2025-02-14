const Category = require("./model/databaseModel");
const multer = require("multer");
const xlsx = require("xlsx");
const bucket = require("./firebaseConfig"); // Firebase Storage Bucket
const fs = require("fs");
const path = require("path");

const upload = multer({ dest: "uploads/" });

const processExcelFromURL = async (req, res) => {
  try {
    // 🔹 Firebase Storage URL of the Excel file
    const excelUrl =
      "https://firebasestorage.googleapis.com/v0/b/varthajanapadanewsapp.firebasestorage.app/o/Category%20PDP_PLP%20External%20Use.xlsx?alt=media&token=17f6d556-98bd-487c-9ec7-19af377e93f1";

    console.log(`Fetching Excel file from: ${excelUrl}`);

    // 🔹 Fetch the file from Firebase Storage
    const response = await fetch(excelUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch Excel file: ${response.statusText}`);
    }

    // 🔹 Read file as Buffer
    const buffer = await response.arrayBuffer();
    const workbook = xlsx.read(buffer, { type: "buffer" });

    // 🔹 Extract the first sheet data
    const sheetName = workbook.SheetNames[0]; // First sheet
    const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!jsonData.length) {
      return res.status(400).json({ message: "Fetched file is empty" });
    }

    console.log(`Excel file contains ${jsonData.length} rows`);

    let processedCount = 0; // Counter for uploaded records

    // 🔹 Convert data to MongoDB format
    const bulkOps = jsonData.map((row) => ({
      updateOne: {
        filter: { L2_category_id: row.L2_category_id }, // Match existing records
        update: { $set: row }, // Update data
        upsert: true, // Insert if not exists
      },
    }));

    // 🔹 Process data in chunks for better performance
    const chunkSize = 100; // Insert 100 records at a time
    for (let i = 0; i < bulkOps.length; i += chunkSize) {
      const chunk = bulkOps.slice(i, i + chunkSize);
      await Category.bulkWrite(chunk);
      processedCount += chunk.length;
      console.log(`Uploaded: ${processedCount}/${jsonData.length}`);
    }

    console.log("Database update completed successfully!");

    res.status(200).json({
      message: "Categories updated successfully",
      totalRecords: jsonData.length,
      updatedRecords: processedCount,
    });
  } catch (error) {
    console.error("Processing Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const searchByL2Category = async (req, res) => {
  try {
    const { L2_category_id } = req.query;

    if (!L2_category_id) {
      return res.status(400).json({ message: "L2_category_id is required" });
    }

    // Convert to number if possible
    const categoryId = isNaN(L2_category_id)
      ? L2_category_id // Keep as string
      : parseInt(L2_category_id, 10);

    console.log(`Searching for L2_category_id:`, categoryId);

    // Query MongoDB (works for both string and number)
    const result = await Category.findOne({
      L2_category_id: categoryId,
    }).lean();

    if (!result) {
      return res.status(404).json({ message: "No matching data found" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllCategories = async (req, res) => {
  try {
    // 🔹 Pagination setup
    const page = parseInt(req.query.page) || 1; // Default page: 1
    const limit = parseInt(req.query.limit) || 50; // Default limit: 50
    const skip = (page - 1) * limit; // Calculate skip count

    console.log(`Fetching categories - Page: ${page}, Limit: ${limit}`);

    // 🔹 Fetch categories from MongoDB with pagination
    const categories = await Category.find()
      .sort({ L2_category_id: 1 }) // Sorting by L2_category_id (ascending)
      .skip(skip)
      .limit(limit)
      .lean();

    // 🔹 Get total count for pagination
    const totalCategories = await Category.countDocuments();

    if (!categories.length) {
      return res.status(404).json({ message: "No categories found" });
    }

    res.status(200).json({
      message: "Categories retrieved successfully",
      totalRecords: totalCategories,
      page,
      totalPages: Math.ceil(totalCategories / limit),
      data: categories,
    });
  } catch (error) {
    console.error("Database Retrieval Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { searchByL2Category, processExcelFromURL, getAllCategories };
