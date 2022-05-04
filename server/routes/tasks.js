const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const { Task } = require('../models/Task');

router.get('/', auth, async (req, res) => {
    try {
        let tasks = await Task.find({});
        let me = req.query.for;
        let by = req.query.by;

        if (me) {
            tasks = tasks.filter(task => task.for === me);
        }
        if (by) {
            tasks = tasks.filter(task => task.by === by);
        }
        res.status(200).send(tasks);
    }
    catch (error) {
        res.status(400).send({ error: error.message })
    }
});

router.post('/', auth, async (req, res) => {
    try {
        let task = new Task({
            title: req.body.title,
            desc: req.body.desc,
            for: req.body.for,
            date: req.body.date,
            by: req.body.by,
            done: req.body.done
        });
        let createdTask = await task.save();
        res.status(201).send(createdTask);
    }
    catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        let taskToDelete = await Task.findByIdAndRemove(req.params.id).exec();
        if (!taskToDelete) {
            throw new Error("Task Not Found")
        }
        return res.status(201).send({ id: req.params.id });
    }
    catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        let updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                description: req.body.description,
                for: req.body.for,
                date: req.body.date,
                by: req.body.by,
                done: req.body.done
            },
            { new: true }
        );
        res.status(201).send(updatedTask);
    }
    catch (error) {
        res.status(400).send({ error: error.message });
    }
});


module.exports = router;