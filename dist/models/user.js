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
UserSchema.method('format', function () {
    return {
        firstName: this.firstName,
        id: this._id,
        lastName: this.lastName,
        passwordHash: '',
        stravaToken: Object.assign({}, this.stravaToken, { refreshToken: '' }),
        username: this.username
    };
});
exports.User = mongoose_1.model('User', UserSchema);
exports.default = exports.User;
//# sourceMappingURL=user.js.map