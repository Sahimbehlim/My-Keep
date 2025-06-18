const User = require("../models/user-schema");
const bcrypt = require("bcrypt");
const { setUser } = require("../utils/auth");

const signUpHandler = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password.length < 6 || password.length > 10) {
      return res
        .status(400)
        .json({ error: "Password must be 6-10 characters long" });
    }

    const isUserExists = await User.findOne({ email });

    if (isUserExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password securely
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

const loginHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = setUser(user);

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

module.exports = { signUpHandler, loginHandler };
