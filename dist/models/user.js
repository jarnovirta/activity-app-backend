"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    passwordHash: { type: String, required: true },
    stravaToken: { type: Object, required: false },
    username: { type: String, required: true, unique: true }
});
UserSchema.statics.format = (user) => {
    return {
        firstName: user.firstName,
        id: user._id,
        lastName: user.lastName,
        stravaToken: Object.assign({}, user.stravaToken, { refreshToken: "" }),
        username: user.username
    };
};
exports.default = mongoose_1.model("User", UserSchema);
//# sourceMappingURL=user.js.map