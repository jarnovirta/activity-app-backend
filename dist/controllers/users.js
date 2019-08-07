"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_1 = __importDefault(require("./../models/user"));
router.get("/", (request, response) => __awaiter(this, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.find({});
        const formatedUsers = users.map(user_1.default.format);
        response.json(formatedUsers);
    }
    catch (e) {
        console.log(e);
        response.status(500).json({ error: "Something went wrong..." });
    }
}));
router.post("/", (request, response) => __awaiter(this, void 0, void 0, function* () {
    console.log("posting user");
    console.log(request.body);
    try {
        let user = new user_1.default(request.body);
        user = yield user.save();
        response.status(201).json(user_1.default.format(user));
    }
    catch (e) {
        console.log(e);
        response.status(500).json({ error: "something went wrong..." });
    }
}));
exports.default = router;
//# sourceMappingURL=users.js.map