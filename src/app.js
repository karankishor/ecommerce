import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(epxress.json({
    limit: "16kb"
}))

app.use(express.urlencoded({extended: true, limit:"16kb"}))
app.use(epxress.static("public"))
app.use(cookieParser())

export {app}