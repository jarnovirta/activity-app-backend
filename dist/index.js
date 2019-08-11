"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const login_1 = __importDefault(require("./controllers/login"));
const oauth_1 = __importDefault(require("./controllers/oauth"));
const users_1 = __importDefault(require("./controllers/users"));
const config_1 = __importDefault(require("./utils/config"));
mongoose_1.default.connect(config_1.default.mongoUrl, { useNewUrlParser: true })
    .then(() => {
    console.log("connected to database", config_1.default.mongoUrl);
})
    .catch((err) => {
    console.log(err);
});
app.use(cors_1.default());
app.use(body_parser_1.default.json());
app.use(express_1.default.static("build"));
app.use("/api/oauth", oauth_1.default);
app.use("/api/users", users_1.default);
app.use("/api/login", login_1.default);
const server = http_1.default.createServer(app);
server.listen(config_1.default.port, () => {
    console.log(`Server running on port ${config_1.default.port}`);
});
server.on("close", () => {
    mongoose_1.default.connection.close();
});
module.exports = {
    app, server
};
//# sourceMappingURL=index.js.map