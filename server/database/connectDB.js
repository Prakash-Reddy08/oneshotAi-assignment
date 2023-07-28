const mongoose = require('mongoose');
require("dotenv").config();
const url = process.env.MONGODB_URL;

const connectDB = () => {
    try {
        mongoose.connect(url);
        console.log('connected to database');
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB;