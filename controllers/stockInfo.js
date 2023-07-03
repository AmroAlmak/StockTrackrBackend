const _ = require("lodash");
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
  const { name, category } = req.body;

  let emptyFields = [];

  if (!name) {
    emptyFields.push("name");
  }
  if (!category) {
    emptyFields.push("category");
  }

  if (emptyFields.length > 0) {
    return res.status(400).json({ error: "Please fill all the fields" });
  }

  try {
    if (req.file && req.file.path) {
      const product = new StockInfo({
        name: req.body.name,
        category: req.body.category,
        imageUrl: req.file.path,
      });
      await product.save();

      return res.status(201).json({ message: "Product saved successfully" });
    } else {
      return res.status(422).json({ error: "there is an error with picture" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createVariant = async (req, res) => {
  const obj = {};
  parentId = req.body.parentId;
  obj.name = req.body.name;
  obj.category = req.body.category;
  obj.quantity = req.body.quantity;
  obj.price = req.body.price;
  obj.size = req.body.size;
  obj.color = req.body.color;
  obj.technicalSpecifications = req.body.technicalSpecifications;
  obj.features = req.body.features;
  obj.description = req.body.description;
  obj.images = [];

  req.files.forEach((el) => obj.images.push(el.path));

  const emptyError = _.values(obj).every(_.isEmpty);

  if (emptyError) {
    return res.status(400).json({ error: "Please fill all the fields" });
  }

  try {
    const parentProduct = await StockInfo.findById(parentId);
    if (!parentProduct) {
      return res
        .status(204)
        .json({ error: `No such product exist with the id of ${parentId}` });
    }

    let totalPrice = _.sumBy(
      parentProduct.variants,
      (el) => el.quantity * el.price
    );

    totalPrice += Number(obj.price) * Number(obj.quantity);

    let totalquantity = _.sumBy(parentProduct.variants, (el) => el.quantity);

    totalquantity += Number(obj.quantity);

    const newParent = await StockInfo.updateOne(
      { _id: parentId },
      {
        $set: { totalPrice, quantity: totalquantity },
        $push: { variants: obj },
      }
    );
    res.status(201).json({ message: "Variant saved successfully." });
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
        .json({ message: "stockInfo deleted successfully", stockInfo });
    } else {
      res.status(404).json({ message: "stockInfo not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteVariant = async (req, res) => {
  try {
    const { id, variantId } = req.params;

    const product = await StockInfo.findById(id);
    const variants = _.filter(product.variants, (el) => el._id !== variantId);

    let totalPrice = _.sumBy(variants, (el) => el.quantity * el.price);

    let quantity = _.sumBy(variants, (el) => el.quantity);

    const response = await StockInfo.updateOne(
      { _id: id },
      {
        $pull: { variants: { _id: variantId } },
        $set: { totalPrice, quantity },
      }
    );
    if (response) {
      res.status(200).json({ message: "Variant deleted successfully" });
    } else {
      res.status(404).json({ message: "Variant not found" });
    }
  } catch (error) {}
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

    res.status(404).json({ message: "ther's no such stockInfo" });
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
  createVariant,
  deleteVariant,
};
