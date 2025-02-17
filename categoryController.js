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
const searchByL2Categoryl2 = async (req, res) => {
  try {
    const { L2_category } = req.query;

    if (!L2_category) {
      return res.status(400).json({ message: "L2_category is required" });
    }

    console.log(`Searching for L2_category or L1_category:`, L2_category);

    // Query MongoDB to search for either L1_category or L2_category (case-insensitive)
    const result = await Category.findOne({
      $or: [
        { L2_category: { $regex: L2_category, $options: "i" } }, // Search in L2_category (case-insensitive)
        { L1_category: { $regex: L2_category, $options: "i" } }, // Search in L1_category (case-insensitive)
      ],
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

const getAllCategoriesWithSearch = async (req, res) => {
  try {
    // 🔹 Pagination setup
    const page = parseInt(req.query.page) || 1; // Default page: 1
    const limit = parseInt(req.query.limit) || 50; // Default limit: 50
    const skip = (page - 1) * limit; // Calculate skip count

    console.log(`Fetching categories - Page: ${page}, Limit: ${limit}`);

    // 🔹 Retrieve the search term (either L2_category or L1_category)
    const searchQuery = req.query.category;

    let query = {};

    if (searchQuery) {
      query = {
        $or: [
          { L2_category: { $regex: searchQuery, $options: "i" } }, // Search in L2_category (case-insensitive)
          { L1_category: { $regex: searchQuery, $options: "i" } }, // Search in L1_category (case-insensitive)
        ],
      };
    }

    // 🔹 Fetch categories from MongoDB with pagination and the search query
    const categories = await Category.find(query)
      .sort({ L2_category_id: 1 }) // Sorting by L2_category_id (ascending)
      .skip(skip)
      .limit(limit)
      .lean();

    // 🔹 Get total count for pagination
    const totalCategories = await Category.countDocuments(query);

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

module.exports = {
  searchByL2Category,
  getAllCategories,
  getAllCategoriesWithSearch,
  searchByL2Categoryl2,
};
