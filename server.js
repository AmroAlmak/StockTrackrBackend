const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
require("colors");

Port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to the server");
});

app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`.black.bgWhite);
});
