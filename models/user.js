// 
import mongoose, { mongo } from "mongoose";

// 
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: true}, {minimize: false})

// 
const userModel = mongoose.models.use || mongoose.model("user", userSchema)

export default userModel