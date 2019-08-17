import dotenv from "dotenv"

if (process.env.NODE_ENV !== "production") {
    dotenv.config()
  }

let port = process.env.PORT
const mongoUrl = process.env.MONGODB_URI
const secret = process.env.SECRET

if (process.env.NODE_ENV === "test") {
    port = process.env.TEST_PORT
    /* mongoUrl = process.env.TEST_MONGODB_URI */

  }

export default {
    mongoUrl,
    port,
    secret
  }
