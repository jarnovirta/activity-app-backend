import dotenv from "dotenv"

if (process.env.NODE_ENV !== "production") {
    dotenv.config()
  }
console.log("*** NODE ENV", process.env.NODE_ENV)
console.log("*** REDIS URL", process.env.REDIS_URL)
let port = process.env.PORT
const mongoUrl = process.env.MONGODB_URI
const secret = process.env.SECRET
const redisUrl = process.env.REDIS_URL

if (process.env.NODE_ENV === "test") {
    port = process.env.TEST_PORT
    /* mongoUrl = process.env.TEST_MONGODB_URI */

  }

export default {
    mongoUrl,
    port,
    secret,
    redisUrl
  }
