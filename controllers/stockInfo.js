const StockInfo = require("../schemas/StockInfo");

const getAllStockInfos = async (req, res) => {
  try {
    const stockInfos = await StockInfo.find();
    if (!stockInfos.length) {
      return res.status(404).json({ message: "No stockInfo found" });
    }
    res.status(200).json(stockInfos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStockInfoById = async (req, res) => {
  try {
    const { id } = req.params;
    const stockInfo = await StockInfo.findById(id);
    if (stockInfo) {
      res.status(200).json(stockInfo);
    } else {
      res.status(404).json({ message: "Stock info not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const createStockInfo = async (req, res) => {
  const { name, variants, category, quantity, price, totalPrice, imageUrl } =
    req.body;

  let emptyFields = [];

  if (!name) {
    emptyFields.push("name");
  }
  if (!category) {
    emptyFields.push("category");
  }
  if (!variants) {
    emptyFields.push("variants");
  }
  if (!quantity) {
    emptyFields.push("quantity");
  }
  if (!price) {
    emptyFields.push("price");
  }
  if (!totalPrice) {
    emptyFields.push("totalPrice");
  }
  if (!imageUrl) {
    emptyFields.push("imageUrl");
  }

  if (emptyFields.length > 0) {
    return res.status(400).json({ error: "Please fill all the fields" });
  }

  try {
    const stockInfo = await StockInfo.create({
      name,
      category,
      variants,
      quantity,
      price,
      totalPrice,
      imageUrl,
    });
    res.status(201).json(stockInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateStockInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, variants, quantity, price, totalPrice } = req.body;
    const stockInfo = await StockInfo.findByIdAndUpdate(
      id,
      { name, category, variants, quantity, price, totalPrice },
      { new: true }
    );
    if (stockInfo) {
      res
        .status(200)
        .json({ msg: "stockInfo updated successfully", stockInfo });
    } else {
      res.status(404).json({ message: "stockInfo not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteStockInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const stockInfo = await StockInfo.findByIdAndDelete(id);
    if (stockInfo) {
      res
        .status(200)
        .json({ msg: "stockInfo deleted successfully", stockInfo });
    } else {
      res.status(404).json({ message: "stockInfo not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const searchStockInfo = async (req, res) => {
  try {
    const { query } = req.query;
    // search also for more by using $or and description
    const stockInfo = await StockInfo.findOne({
      name: { $regex: query, $options: "i" },
    });

    if (stockInfo) {
      return res.status(200).json({ data: stockInfo });
    }

    res.status(404).json({ msg: "ther's no such stockInfo" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllStockInfos,
  createStockInfo,
  getStockInfoById, 
  updateStockInfo,
  deleteStockInfo,
  searchStockInfo,
};

