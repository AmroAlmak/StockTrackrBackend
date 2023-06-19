const express = require("express");
const {
  loginUser,
  signupUser,
  updatePassword,
  deleteUser,
} = require("../controllers/user");

const app = express.Router();

app.post("/login", loginUser);
app.post("/signup", signupUser);

const requireAuth = require("../middlewares/requireAuth");
app.use(requireAuth);

app.put("/updatepassword", updatePassword);
app.delete("/:id", deleteUser);

module.exports = app;
