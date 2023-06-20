const User = require("../schemas/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};
// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.status(200).json({ username: user.username, userId: user._id, token });
  } catch (err) {
    res.status(400).json(err.message);
  }
};

// signup user

const signupUser = async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const user = await User.signup(email, password, username);
    const token = createToken(user._id);
    res.status(200).json({ username: user.username, userId: user._id, token });
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (user) {
      res.status(200).json({ msg: "user deleted successfully" });
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePassword = async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  try {
    // Find the user by their ID
    const user = await User.findById(userId);

    // Verify if the current password matches the stored password
    const isPasswordMatch = await user.comparePassword(currentPassword);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Set the new hashed password
    user.password = hashedPassword;

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get one user

const getOneUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  loginUser,
  signupUser,
  updatePassword,
  deleteUser,
  getOneUser,
};
