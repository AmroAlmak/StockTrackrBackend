const express = require("express");
const router = express.Router();
const {
  getAllStockInfos,
  createStockInfo,
  getStockInfoById, 
  updateStockInfo,
  deleteStockInfo,
  searchStockInfo,
} = require("../controllers/stockInfo");

const requireAuth = require("../middlewares/requireAuth");
// router.use(requireAuth);

router.route("/")
  .get(getAllStockInfos)
  .post(createStockInfo);

  router.route("/product/:id")
  .get(getStockInfoById);

router.route("/:id")
  .put(updateStockInfo)
  .delete(deleteStockInfo);

router.route("/search")
  .get(searchStockInfo);

module.exports = router;
