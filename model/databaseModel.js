const mongoose = require("mongoose");

const DatabaseSchema = new mongoose.Schema({
  L0_category: {
    type: String,
    required: true,
  },
  L1_category: {
    type: String,
    required: true,
  },
  L1_category_id: {
    type: String,
    required: true,
  },
  L2_category: {
    type: String,
    required: true,
  },
  L2_category_id: {
    type: Number,
    required: true,
    index: true,
  },
  PDP1: {
    type: String,
  },
  PDP2: {
    type: String,
  },
  PDP3: {
    type: String,
  },
  PDP4: {
    type: String,
  },
  PDP5: {
    type: String,
  },
  PDP6: {
    type: String,
  },
  PDP7: {
    type: String,
  },
  PDP8: {
    type: String,
  },
  PDP9: {
    type: String,
  },
  PDP10: {
    type: String,
  },
  PDP11: {
    type: String,
  },
  PLP1: {
    type: String,
  },
  PLP2: {
    type: String,
  },
  PLP3: {
    type: String,
  },
  PLP4: {
    type: String,
  },
  Count_Of_PIDs: {
    type: String,
  },
});
const Category = mongoose.model("Category", DatabaseSchema);
module.exports = Category;
