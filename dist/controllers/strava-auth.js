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
const stravaTokenUrl = "https://www.strava.com/oauth/token";
const getStravaTokens = (code) => __awaiter(this, void 0, void 0, function* () {
    const params = {
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code,
        grant_type: "authorization_code"
    };
    const response = yield axios_1.default.post(stravaTokenUrl, params);
    return response.data;
});
const refreshStravaTokens = (refreshToken) => __awaiter(this, void 0, void 0, function* () {
    const params = {
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: refreshToken
    };
    const response = yield axios_1.default.post(stravaTokenUrl, params);
    const token = {
        accessToken: response.data.access_token,
        expiresAt: response.data.expires_at,
        refreshToken: response.data.refresh_token
    };
    return token;
});
router.get("/authCode/:userId", (request, response) => __awaiter(this, void 0, void 0, function* () {
    const code = request.query.code;
    const devFrontServer = process.env.DEV_FRONT_SERVER_URL;
    const tokens = yield getStravaTokens(code);
    const stravaUser = getUser(tokens);
    yield user_1.default.updateOne({ _id: request.params.userId }, {
        stravaToken: stravaUser.stravaToken
    });
    const redirectUrl = devFrontServer ? devFrontServer : "/";
    response.redirect(redirectUrl);
}));
router.get("/redirectUrl", (request, response) => {
    const url = `${process.env.SERVER_URL}:${process.env.PORT}`
        + `/api/oauth/authCode`;
    response.send(url);
});
router.post("/refreshToken", (request, response) => __awaiter(this, void 0, void 0, function* () {
    const user = yield user_1.default.findById(request.body.userId);
    const token = yield refreshStravaTokens(user.stravaToken.refreshToken);
    yield user.update({
        stravaToken: token
    });
    response.status(200).json(user);
}));
const getUser = (stravaTokenResponse) => {
    return {
        firstName: stravaTokenResponse.athlete.firstname,
        lastName: stravaTokenResponse.athlete.lastname,
        stravaToken: {
            accessToken: stravaTokenResponse.access_token,
            expiresAt: stravaTokenResponse.expires_at,
            refreshToken: stravaTokenResponse.refresh_token
        },
        username: stravaTokenResponse.athlete.username
    };
};
exports.default = router;
//# sourceMappingURL=strava-auth.js.map