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
const user_1 = __importDefault(require("./../models/user"));
router.post("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log("Logging in user");
    console.log(req.session);
    try {
        const existingUser = yield user_1.default.findOne({ username: req.body.username });
        let validPasswordHash;
        if (existingUser) {
            validPasswordHash = existingUser.passwordHash;
        }
        const user = existingUser ? user_1.default.format(existingUser) : null;
        const correctCreds = user === null ?
            false :
            yield bcrypt_1.default.compare(req.body.password, validPasswordHash);
        if (!(correctCreds)) {
            return res.status(401).json({ error: "invalid username or password" });
        }
        req.session.userId = user.id;
        res.status(200).json(user);
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ error: "something went wrong..." });
    }
}));
router.get("/currentUser", (req, res) => __awaiter(this, void 0, void 0, function* () {
    if (req.session.userId) {
        const loggedInUser = yield user_1.default.findOne({
            _id: req.session.userId
        });
        res.status(200).json(user_1.default.format(loggedInUser));
        return;
    }
    res.status(401).json({ message: "User not logged in" });
}));
router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return console.log(err);
        }
    });
    res.sendStatus(200);
});
exports.default = router;
//# sourceMappingURL=login.js.map