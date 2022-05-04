const express = require('express');
const cors = require('cors');
const app = express();

const connect = require('./connect');

const users = require('./routes/users');
const tasks = require('./routes/tasks');
const auth = require('./routes/auth');

app.use(cors());
app.use(express.json());
app.use('/api/users', users);
app.use('/api/tasks', tasks);
app.use('/api/auth', auth);

const PORT = process.env.PORT ?? 5000;
app.listen(PORT, () => {
    console.info(`App Running on Port ${PORT}`)
    connect("Tasks");
});