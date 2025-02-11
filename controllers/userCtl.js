//
import bcrypt from "bcrypt";
import userModel from "../models/user.js";
import validator from "validator";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

//
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT);
};

const loginUser = async (req, res) => {
  // Extract username, email, and password from request body
  const { username, email, password } = req.body;

  try {
    // Check if either username or email is provided
    let user;
    if (email) {
      // Search for user by email if email is provided
      user = await userModel.findOne({ email });
    } else if (username) {
      // Search for user by username if username is provided
      user = await userModel.findOne({ username });
    } else {
      return res.status(400).json({
        header: {
          status: "BAD_REQUEST",
          success: "fail",
          message: "Please provide either a username or an email.",
        },
        body: {},
      });
    }

    // If user not found
    if (!user) {
      return res.status(400).json({
        header: {
          status: "BAD_REQUEST",
          success: "fail",
          message: "Invalid credentials!",
        },
        body: {},
      });
    }

    // Compare the password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    // If password doesn't match
    if (!isMatch) {
      return res.status(400).json({
        header: {
          status: "BAD_REQUEST",
          success: "fail",
          message: "Invalid credentials!",
        },
        body: {},
      });
    }

    // Generate token
    const token = createToken(user._id);

    // Send successful response
    res.status(200).json({
      header: {
        status: "SUCCESS",
        success: "true",
        message: `Welcome, ${user.username}`,
      },
      body: {
        id: user._id,
        token: token,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      header: {
        status: "",
        success: "fail",
        message: error.message,
      },
      body: {},
    });
  }
};

//
const registerUser = async (req, res) => {
  //
  const { username, email, password } = req.body;

  //
  try {
    //
    const exists = await userModel.findOne({
      email,
    });
    if (exists) {
      return res.status(400).json({
        header: {
          status: "BAD_REQUEST",
          success: "fail",
          message: "User already exist!",
        },
        body: {},
      });
    }

    //
    if (!validator.isEmail(email)) {
      //
      return res.status(400).json({
        header: {
          status: "BAD_REQUEST",
          success: "fail",
          message: "Please enter a vaild email",
        },
        body: {},
      });
    }

    //
    if (password.length < 8) {
      res.status(400).json({
        header: {
          status: "BAD_REQUEST",
          success: "fail",
          message: "Please enter a strong password",
        },
        body: {},
      });
    }

    //
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //
    const newUser = new userModel({
      username: username,
      email: email,
      password: hashedPassword,
    });

    //
    const user = await newUser.save();

    //
    const token = createToken(user._id);

    //
    res.status(201).json({
      header: {
        status: "SUCCESS",
        success: "true",
        message: "User created!",
      },
      body: {
        id: user._id,
        token: token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      header: {
        status: "",
        success: "fail",
        message: error.message,
      },
      body: {},
    });
  }
};

export { registerUser, loginUser };
