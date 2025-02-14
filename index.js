const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./mongoconfig");
const Category = require("./categoryRoutes");

dotenv.config();

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

connectDB();
app.use(express.json());
app.use("/api/category", Category);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
