const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
    color: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    }
});


const stockInfoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  variants: [variantSchema], 
  category: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("StockInfo", stockInfoSchema);
