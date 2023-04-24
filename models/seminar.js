const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const seminarSchema = new Schema({
    title: String,
    location: String,
    speaker: String,
    description: String,
    date: Date,
    time: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Seminar', seminarSchema);