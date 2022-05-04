const express = require('express');
const router = express.Router();

const { User } = require('../models/User');

router.post('/', async (req, res) => {
    try {
        const user = await User.findOne({
            userName: req.body.userName,
            password: req.body.password
        });
        if (!user) {
            throw new Error("User Not Found")
        }
        const token = user.generateAuthToken(user._id, user.userName);
        res.status(201).send({ token });
    }
    catch (error) {
        res.status(400).send({ error: error.message });
    }
});

module.exports = router;