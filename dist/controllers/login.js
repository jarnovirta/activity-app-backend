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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("./../models/user"));
router.post("/", (request, response) => __awaiter(this, void 0, void 0, function* () {
    console.log("Logging in user");
    console.log(request.body);
    try {
        const existingUser = yield user_1.default.findOne({ username: request.body.username });
        let validPasswordHash;
        if (existingUser) {
            validPasswordHash = existingUser.passwordHash;
        }
        const user = existingUser ? user_1.default.format(existingUser) : null;
        const correctCreds = user === null ?
            false :
            yield bcrypt_1.default.compare(request.body.password, validPasswordHash);
        if (!(correctCreds)) {
            return response.status(401).json({ error: "invalid username or password" });
        }
        const tokenUser = {
            id: user.id,
            username: user.username
        };
        user.loginToken = jsonwebtoken_1.default.sign(tokenUser, process.env.SECRET);
        response.status(200).send(user);
    }
    catch (e) {
        console.log(e);
        response.status(500).json({ error: "something went wrong..." });
    }
}));
exports.default = router;
//# sourceMappingURL=login.js.map