const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json("All fields required");

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json("User already exists");

    const hash = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hash });
    await user.save();

    res.json({ message: "Registered successfully" });

  } catch (err) {
    res.status(500).json("Server error");
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json("User not found");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json("Wrong password");

    const token = jwt.sign({ id: user._id }, "secretkey");

    res.json({
  token,
  user
});

  } catch {
    res.status(500).json("Server error");
  }
});

module.exports = router;