const express = require("express");
const app = express.Router();
const {
  getAllStockInfos,
  createStockInfo,
  updateStockInfo,
  deleteStockInfo,
  searchStockInfo,
} = require("../controllers/stockInfo");

const requireAuth = require("../middlewares/requireAuth");
// app.use(requireAuth);

app.route("/").get(getAllStockInfos).post(createStockInfo);
app.route("/:id").put(updateStockInfo).delete(deleteStockInfo);
app.route("/search").get(searchStockInfo);

module.exports = app;
