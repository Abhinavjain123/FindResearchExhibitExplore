const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const webinarSchema = new Schema({
    title: String,
    link: String,
    description: String,
    date: Date,
    time: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Webinar', webinarSchema);