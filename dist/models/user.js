"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
    username: { type: String, required: true, unique: true }
});
UserSchema.statics.format = (user) => {
    return {
        id: user._id,
        name: user.name,
        username: user.username
    };
};
exports.default = mongoose_1.model("User", UserSchema);
//# sourceMappingURL=user.js.map