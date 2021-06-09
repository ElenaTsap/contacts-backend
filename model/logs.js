const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    dateTime: {
        type: Date,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    preData: {
        type: String
    },
    postData: {
        type: String
    }
})

module.exports = mongoose.model('logs', logSchema)