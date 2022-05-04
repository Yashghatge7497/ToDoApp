const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, "Username Required"]
    },
    password: {
        type: String,
        required: [true, "Password Required"]
    },
});

userSchema.methods.generateAuthToken = function (userId, userName) {
    const token = jwt.sign({ sub: userId, userName }, "someprivatekey");
    return token;
}

const User = new mongoose.model("User", userSchema);

module.exports = {
    User,
    userSchema
};  