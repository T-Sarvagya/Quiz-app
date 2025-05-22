const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    name: String,
    email: String,
    score: Number,
    rank: Number,
    result: String,
    timestamp: Number
});

module.exports = mongoose.model('Result', resultSchema);