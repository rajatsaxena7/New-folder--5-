const Category = require("./model/databaseModel");

const xlsx = require("xlsx");

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
