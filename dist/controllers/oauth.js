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
const getStravaTokens = (code) => __awaiter(this, void 0, void 0, function* () {
    const url = "https://www.strava.com/oauth/token";
    const params = {
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code,
        grant_type: "authorization_code"
    };
    const response = yield axios_1.default.post(url, params);
    return response.data;
});
router.get("/authCode/:userId", (request, response) => __awaiter(this, void 0, void 0, function* () {
    const code = request.query.code;
    const devFrontServer = process.env.DEV_FRONT_SERVER_URL;
    const redirectUrl = devFrontServer ? devFrontServer : "/";
    const tokens = yield getStravaTokens(code);
    console.log("tokens", tokens);
    const user = getUser(tokens);
    console.log("Strava user", user);
    console.log("Redirecting");
    response.redirect(redirectUrl);
}));
router.get("/redirectUrl", (request, response) => {
    console.log("Got request for redirectUrl");
    const MOCK_USER_ID = 1234567;
    const url = `${process.env.SERVER_URL}:${process.env.PORT}`
        + `/api/oauth/authCode/${MOCK_USER_ID}`;
    response.send(url);
});
const getUser = (stravaTokenResponse) => {
    return {
        name: stravaTokenResponse.athlete.firstname,
        stravaAccessToken: stravaTokenResponse.access_token,
        stravaRefreshToken: stravaTokenResponse.refresh_token,
        username: stravaTokenResponse.athlete.username
    };
};
exports.default = router;
//# sourceMappingURL=oauth.js.map