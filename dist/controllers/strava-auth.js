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
const axios_1 = __importDefault(require("axios"));
const user_1 = __importDefault(require("../models/user"));
const stravaApiTokenUrl = 'https://www.strava.com/oauth/token';
router.get('/authCode/:userId', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const code = req.query.code;
    const id = req.params.userId;
    const devFrontServerUrl = process.env.DEV_FRONT_SERVER_URL;
    try {
        const response = yield getStravaTokens(code);
        const token = {
            accessToken: response.access_token,
            expiresAt: response.expires_at,
            refreshToken: response.refresh_token
        };
        yield user_1.default.updateOne({ _id: id }, {
            stravaToken: token
        });
    }
    catch (e) {
        console.log(e);
    }
    const redirectUrl = devFrontServerUrl ? devFrontServerUrl : '/';
    res.redirect(redirectUrl);
}));
router.get('/redirectUrl', (req, res) => {
    const url = `${process.env.SERVER_URL}:${process.env.PORT}`
        + `/api/oauth/authCode`;
    res.send(url);
});
router.post('/refreshToken', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const user = yield user_1.default.findById(req.body.userId);
    const token = yield refreshStravaTokens(user.stravaToken.refreshToken);
    yield user.updateOne({
        stravaToken: token
    });
    res.status(200).json(user.stravaToken);
}));
const getStravaTokens = (code) => __awaiter(this, void 0, void 0, function* () {
    const params = {
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code'
    };
    const response = yield axios_1.default.post(stravaApiTokenUrl, params);
    return response.data;
});
const refreshStravaTokens = (refreshToken) => __awaiter(this, void 0, void 0, function* () {
    const params = {
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: refreshToken
    };
    const response = yield axios_1.default.post(stravaApiTokenUrl, params);
    const token = {
        accessToken: response.data.access_token,
        expiresAt: response.data.expires_at,
        refreshToken: response.data.refresh_token
    };
    return token;
});
exports.default = router;
//# sourceMappingURL=strava-auth.js.map