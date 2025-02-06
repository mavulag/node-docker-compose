// 
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { ConnectDB } from './db/db.js'
import dotenv from 'dotenv'
import userRouter from './routes/userRoute.js'
dotenv.config()

// 
const app = express()

// 
const PORT = process.env.PORT || 5000

// 
ConnectDB()

// 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors())

// 
app.use("/api/v1/user", userRouter)

// 
app.listen(PORT, (() => {
    console.log(`Server running on port: ${PORT}`)
}))