// 
import express from "express";
import { registerUser } from "../controllers/userCtl.js";

// 
const userRouter = express.Router()

// 
userRouter.route("/register").post(registerUser)

// 
export default userRouter