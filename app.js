require("express-async-errors") 
require("dotenv").config({path:"/home/bestin/Desktop/projects/my-movie-collection/.env"})
const mongoConnect = require("./db/mongo-connect")
const redisConnect = require("./db/redis-connect")
//express package
const express = require("express");
const app = express()

//extra packages

const cookieParser = require("cookie-parser")
const morgon = require("morgan")

app.use(cookieParser())
app.use(express.json())
app.use(morgon("tiny"));

// security packages

const ratelimiter = require('express-rate-limit');
const xssClean = require("xss-clean");
const helmet = require("helmet");
const cors = require("cors")

app.set('trust proxy', 1)
app.use(ratelimiter({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100}))

app.use(helmet())
app.use(xssClean())
app.use(cors())

//routers

const authRouter = require("./router/auth")
const movie = require("./router/movie")

app.use("/api/v1/auth",authRouter)
app.use("/api/v1/movie",movie)


//middlewares

const notFoundMiddleware = require("./middleware/not-found")
const errorHandleMiddleware = require("./middleware/error-handle")

app.use(notFoundMiddleware)
app.use(errorHandleMiddleware)


//main app

const port = 5000 || process.env.PORT

const start = async () => {
    try {
        await mongoConnect(process.env.MONGOOSE_URL)
        app.listen(port,() => {
            console.log(`Server is listening on port ${port}....`)
        })
        redisConnect.connect()
    } catch (error) {
        console.log(error)   
    }
    
}
start()















