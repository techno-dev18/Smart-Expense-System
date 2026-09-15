const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ==========================================
// GENERATE JWT
// ==========================================

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error(
      "JWT_SECRET is not configured."
    );
  }

  return jwt.sign(
    {
      id: userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// ==========================================
// USER RESPONSE
// Never return password
// ==========================================

const getUserResponse = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
};

// ==========================================
// REGISTER USER
// ==========================================

const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    // ------------------------------------------
    // Check required fields
    // ------------------------------------------

    if (
      !name ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required.",
      });
    }

    // ------------------------------------------
    // Normalize input
    // ------------------------------------------

    const normalizedName =
      name.trim();

    const normalizedEmail =
      email.trim().toLowerCase();

    // ------------------------------------------
    // Validate name
    // ------------------------------------------

    if (
      normalizedName.length < 2
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name must contain at least 2 characters.",
      });
    }

    if (
      normalizedName.length > 50
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name cannot exceed 50 characters.",
      });
    }

    // ------------------------------------------
    // Validate email
    // ------------------------------------------

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(
        normalizedEmail
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide a valid email address.",
      });
    }

    // ------------------------------------------
    // Validate password
    // ------------------------------------------

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 8 characters.",
      });
    }

    if (password.length > 100) {
      return res.status(400).json({
        success: false,
        message:
          "Password cannot exceed 100 characters.",
      });
    }

    // ------------------------------------------
    // Check existing user
    // ------------------------------------------

    const existingUser =
      await User.findOne({
        email: normalizedEmail,
      });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "User already exists.",
      });
    }

    // ------------------------------------------
    // Hash password
    // ------------------------------------------

    const hashedPassword =
      await bcrypt.hash(
        password,
        12
      );

    // ------------------------------------------
    // Create user
    // ------------------------------------------

    const user =
      await User.create({
        name: normalizedName,
        email: normalizedEmail,
        password: hashedPassword,
      });

    // ------------------------------------------
    // Generate JWT
    // ------------------------------------------

    const token =
      generateToken(user._id);

    // ------------------------------------------
    // Response
    // ------------------------------------------

    return res.status(201).json({
      success: true,
      message:
        "User registered successfully.",
      token,
      user:
        getUserResponse(user),
    });
  } catch (error) {
    console.error(
      "Register Error:",
      error
    );

    // ------------------------------------------
    // MongoDB duplicate key protection
    // ------------------------------------------

    if (
      error.code === 11000
    ) {
      return res.status(400).json({
        success: false,
        message:
          "An account with this email already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Server error.",
    });
  }
};

// ==========================================
// LOGIN USER
// ==========================================

const loginUser = async (
  req,
  res
) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // ------------------------------------------
    // Check required fields
    // ------------------------------------------

    if (
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required.",
      });
    }

    // ------------------------------------------
    // Normalize email
    // ------------------------------------------

    const normalizedEmail =
      email.trim().toLowerCase();

    // ------------------------------------------
    // Validate email format
    // ------------------------------------------

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(
        normalizedEmail
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide a valid email address.",
      });
    }

    // ------------------------------------------
    // Find user
    // ------------------------------------------

    const user =
      await User.findOne({
        email: normalizedEmail,
      });

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    // ------------------------------------------
    // Compare password
    // ------------------------------------------

    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    // ------------------------------------------
    // Generate JWT
    // ------------------------------------------

    const token =
      generateToken(user._id);

    // ------------------------------------------
    // Response
    // ------------------------------------------

    return res.status(200).json({
      success: true,
      message:
        "Login successful.",
      token,
      user:
        getUserResponse(user),
    });
  } catch (error) {
    console.error(
      "Login Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error.",
    });
  }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  registerUser,
  loginUser,
};