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
router.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.find({});
        const formatedUsers = users.map(user => user.format());
        res.json(formatedUsers);
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Something went wrong...' });
    }
}));
router.post('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const saltRounds = 10;
        const passwordHash = yield bcrypt_1.default.hash(req.body.password, saltRounds);
        const user = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            passwordHash,
            username: req.body.username
        };
        const mongoUser = new user_1.default(user);
        const savedUser = yield mongoUser.save();
        res.status(201).json(savedUser.format());
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Something went wrong...' });
    }
}));
exports.default = router;
//# sourceMappingURL=users.js.map