import express, { Application, Response, Request } from 'express'
const app: Application = express()
import connectRedis from 'connect-redis'
import session from 'express-session'
import redis from 'redis'
const redisStore = connectRedis(session)
import bodyParser from 'body-parser'
import cors from 'cors'
import http from 'http'
import mongoose from 'mongoose'
import path from 'path'
import loginRouter from './controllers/login'
import stravaAuthRouter from './controllers/strava-auth'
import userRouter from './controllers/users'
import config from './utils/config'
import { Http2Server } from 'http2';

const mongooseOptions = { 
    useCreateIndex: true,
    useNewUrlParser: true
 }
mongoose.connect(config.mongoUrl, mongooseOptions)
    .then(() => {
        console.log('Connected to database: ', config.mongoUrl)
    })
    .catch((err) => {
        console.log(err)
    })

const redisClient: redis.RedisClient = redis.createClient(config.redisUrl)
redisClient.on('error', (err) => {
    console.log(err)
    process.exit(1)
})
app.use(session({
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000
    },
    resave: false,
    saveUninitialized: false,
    secret: config.secret,

    store: new redisStore({
        client: redisClient,
        url: config.redisUrl,
        ttl: 260
    })
}))

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('front'))
app.use('/api/stravaauth', stravaAuthRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, '../front', 'index.html'));
})
const server: Http2Server = http.createServer(app)

server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`)

})
server.on('close', () => {
    mongoose.connection.close()
})

module.exports = {
    app, server
}
