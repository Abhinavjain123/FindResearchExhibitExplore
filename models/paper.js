const mongoose = require('mongoose');
const { paperSchema } = require('../schemas');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: String,
    filename: String
})

imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200');
})

const opts = {toJSON: { virtuals : true }};

const PaperSchema = new Schema({
    title: String,
    images: [imageSchema],
    description: String,
}, opts);

PaperSchema.virtual('properties.popUpMarker').get(function(){
    return `<strong><a href="/papers/${this._id}">${this.title}</a></strong>`
})

PaperSchema.post('findOneAndDelete', async function(paper){
    
})

module.exports = mongoose.model('Paper', PaperSchema);