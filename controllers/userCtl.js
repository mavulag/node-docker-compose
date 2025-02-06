//
import bcrypt from "bcrypt";
import userModel from "../models/user.js";
// import validator from "validator";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()

// 
const createToken = (id) => {
    return jwt.sign({id},process.env.JWT)
}

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
    // if (validator.isEmail(email)) {
    //   //
    //   return res.status(400).json({
    //     header: {
    //       status: "BAD_REQUEST",
    //       success: "fail",
    //       message: "Please enter a vaild email",
    //     },
    //     body: {},
    //   });
    // }

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
      },
      body: {
        message: `User ${user._id} created!`,
        token: token,
      },
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
        header: {
            status: "BAD_REQUEST",
            success: "fail",
            message: error.message,
          },
          body: {},
    })
  }
};

export {registerUser}