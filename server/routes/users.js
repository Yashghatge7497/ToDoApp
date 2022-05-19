const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const { User } = require('../models/User');

router.get('/', async (req, res) => {
    try {
        let users = await User.find({});
        res.status(200).send(users);
    }
    catch (error) {
        res.status(400).send({ error: error.message })
    }
});

router.get('/id', auth, async (req, res) => {
    try {
        let user = await User.findById(req.params.id).exec();
        res.status(200).send(user);
    }
    catch (error) {
        res.status(400).send({ error: error.message })
    }
});

router.post('/', async (req, res) => {
    try {
        let user = new User({
            userName: req.body.userName,
            password: req.body.password,
        });
        let createdUser = await user.save();
        res.status(201).send(createdUser);
    }
    catch (error) {
        res.status(400).send({ error: error.message });
    }
});

module.exports = router;//