"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
if (process.env.NODE_ENV !== "production") {
    dotenv_1.default.config();
}
console.log("*** NODE ENV", process.env.NODE_ENV);
console.log("*** REDIS URL", process.env.REDIS_URL);
let port = process.env.PORT;
const mongoUrl = process.env.MONGODB_URI;
const secret = process.env.SECRET;
const redisUrl = process.env.REDIS_URL;
if (process.env.NODE_ENV === "test") {
    port = process.env.TEST_PORT;
    /* mongoUrl = process.env.TEST_MONGODB_URI */
}
exports.default = {
    mongoUrl,
    port,
    secret,
    redisUrl
};
//# sourceMappingURL=config.js.map