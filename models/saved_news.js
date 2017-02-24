// Dependency
// hook mongoose into the model with a require
var mongoose = require('mongoose');
// Then, save the mongoose.Schema class/constructor object as a variable named Schema.
var Schema = mongoose.Schema;

// instantiate SavedNews object with structure of data and its rules
var SavedNews = new Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    byline: {
        type: String,
        trim: true,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    excerpt: {
        type: String,
        required: true
    }
});

// Create the 'Saved' model with our SavedNews schema 
var Saved = mongoose.model('Saved', SavedNews);

// Export the 'Saved' model to use in the news_app_controller.js
module.exports = Saved;