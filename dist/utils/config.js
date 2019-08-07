"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
if (process.env.NODE_ENV !== "production") {
    dotenv_1.default.config();
}
let port = process.env.PORT;
const mongoUrl = process.env.MONGODB_URI;
if (process.env.NODE_ENV === "test") {
    port = process.env.TEST_PORT;
    /* mongoUrl = process.env.TEST_MONGODB_URI */
}
exports.default = {
    mongoUrl,
    port
};
//# sourceMappingURL=config.js.map