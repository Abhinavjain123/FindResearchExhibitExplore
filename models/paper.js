const mongoose = require('mongoose');
const { paperSchema } = require('../schemas');
const Schema = mongoose.Schema;
const Suggestion = require('./suggestion')

const opts = {toJSON: { virtuals : true }};

const PaperSchema = new Schema({
    title: String,
    link: String,
    description: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    suggestions: [
        {
            type : Schema.Types.ObjectId,
            ref: 'Suggestion'
        }
    ]
}, opts);

PaperSchema.virtual('properties.popUpMarker').get(function(){
    return `<strong><a href="/papers/${this._id}">${this.title}</a></strong>`
})

PaperSchema.post('findOneAndDelete', async function(paper){
    if(paper.suggestions.length){
        const data = await Suggestion.deleteMany({ _id: {$in:paper.suggestions}})
    }
})

module.exports = mongoose.model('Paper', PaperSchema);