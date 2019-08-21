import dotenv from 'dotenv'

if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
  }

let port: number = parseInt(process.env.PORT)
const mongoUrl: string = process.env.MONGODB_URI
const secret: string = process.env.SECRET
const redisUrl: string = process.env.REDIS_URL

if (process.env.NODE_ENV === 'test') {
    port = parseInt(process.env.TEST_PORT)
    /* mongoUrl = process.env.TEST_MONGODB_URI */

  }

export default {
    mongoUrl,
    port,
    secret,
    redisUrl
  }
