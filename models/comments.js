// Dependency
// hook mongoose into the model with a require
var mongoose = require('mongoose');
// Then, save the mongoose.Schema class/constructor object as a variable named Schema.
var Schema = mongoose.Schema;

// instantiate Comments object with structure of data and its rules
var Comments = new Schema({
    message: {
        type: String,
        trim: true,
        required: true
    },
    articleId: {
        type: String,
        trim: true,
        required: false
    }
});

// Create the 'Comments' model with our SavedNews schema 
var Comments = mongoose.model('Comments', Comments);

// Export the 'Saved' model to use in the news_app_controller.js
module.exports = Comments;