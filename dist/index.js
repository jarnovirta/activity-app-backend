"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const connect_redis_1 = __importDefault(require("connect-redis"));
const express_session_1 = __importDefault(require("express-session"));
const redis_1 = __importDefault(require("redis"));
const redisStore = connect_redis_1.default(express_session_1.default);
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const login_1 = __importDefault(require("./controllers/login"));
const strava_auth_1 = __importDefault(require("./controllers/strava-auth"));
const users_1 = __importDefault(require("./controllers/users"));
const config_1 = __importDefault(require("./utils/config"));
const mongooseOptions = {
    useCreateIndex: true,
    useNewUrlParser: true
};
mongoose_1.default.connect(config_1.default.mongoUrl, mongooseOptions)
    .then(() => {
    console.log('connected to database', config_1.default.mongoUrl);
})
    .catch((err) => {
    console.log(err);
});
const redisClient = redis_1.default.createClient(config_1.default.redisUrl);
redisClient.on('error', (err) => {
    console.log(err);
    process.exit(1);
});
app.use(express_session_1.default({
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000
    },
    resave: false,
    saveUninitialized: false,
    secret: config_1.default.secret,
    store: new redisStore({
        client: redisClient,
        url: config_1.default.redisUrl,
        ttl: 260
    })
}));
app.use(cors_1.default());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static('front'));
app.use('/api/stravaauth', strava_auth_1.default);
app.use('/api/users', users_1.default);
app.use('/api/login', login_1.default);
app.get('*', (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, './../front', 'index.html'));
});
const server = http_1.default.createServer(app);
server.listen(config_1.default.port, () => {
    console.log(`Server running on port ${config_1.default.port}`);
});
server.on('close', () => {
    mongoose_1.default.connection.close();
});
module.exports = {
    app, server
};
//# sourceMappingURL=index.js.map