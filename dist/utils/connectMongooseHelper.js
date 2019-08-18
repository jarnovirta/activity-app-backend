"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongooseOptions = {
    useCreateIndex: true,
    useNewUrlParser: true
};
try {
    yield mongoose_1.default.connect(config.mongoUrl, mongooseOptions);
    console.log("connected to database", config.mongoUrl);
}
catch (e) {
    console.log(e);
}
//# sourceMappingURL=connectMongooseHelper.js.map