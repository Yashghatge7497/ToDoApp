const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "title Required"]
    },
    desc: {
        type: String,
        required: [true, "Description Required"]
    },
    for: {
        type: String,
        required: [true, "For Required"]
    },
    date: {
        type: String,
        required: [true, "date Required"]
    },
    by: {
        type: String,
        required: [true, "Created By Required"]
    },
    done: {
        type: Boolean,
        required: [true, "Done property is required"]
    }
});

const Task = new mongoose.model("Task", taskSchema);

module.exports = {
    Task,
    taskSchema
};  