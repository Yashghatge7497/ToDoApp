const mongoose = require('mongoose');
module.exports = async function (dbName) {
    try {
        await mongoose.connect(`mongodb+srv://Yashghatge:Yash%407497@cluster0.d8pdo.mongodb.net/${dbName}?retryWrites=true&w=majority`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected To { " + dbName + " } database succesfully");
    }
    catch (error) {
        console.log(error.message);
    }
};