// Dependencies:

var express = require('express');
var exphbs = require('express-handlebars');
var app = express();
var mongoose = require('mongoose');
var rp = require('request-promise');
mongoose.Promise = Promise;
// Import router and assign to routes
var routes = require('./controllers/news_app_controller.js');


// bodyparser to read the body of the json object
var bodyParser = require('body-parser');

// Snatches HTML from URLs
var request = require('request');
// scrapes HTML
var cheerio = require('cheerio');
// require the 'Saved' module to get access to the model and create new models
var Saved = require('./models/saved_news.js');
//--------------end of dependencies----------------------------------------------------------

// -----------------connections to host, mongoose, and mongodb-------------------------------
var PORT = process.env.PORT || 8080;

// connect mongoose to localhost/database name 'news_app_db'
mongoose.connect('mongodb://localhost/news_app_db');
// save mongoose connection to var db
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('We\'re connected!');
});

// -----------------------------middleware----------------------------------------------------
// serve/route to static content
app.use(express.static(process.cwd() + '/public'));

// interpret data as json object
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// use handlebars and set the default layout as main.js
app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


// ----------------------------routes--------------------------------------------------------
// use the get/post/update routes in news_app_controller.js
app.use('/', routes);

app.listen(PORT, function() {
    console.log('App listening on PORT ' + PORT);
});