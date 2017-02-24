// Dependencies:

var express = require('express');
var exphbs = require('express-handlebars');
var app = express();
var mongoose = require('mongoose');
var rp = require('request-promise');
mongoose.Promise = Promise;

var db = mongoose.connection;
// var db = require('...');

// bodyparser to read the body of the json object
var bodyParser = require('body-parser');

// Snatches HTML from URLs
var request = require('request');
// scrapes HTML
var cheerio = require('cheerio');
//--------------end of dependencies----------------------------------------------------------
var PORT = process.env.PORT || 8080;

mongoose.connect('mongodb://localhost/test');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('We\'re connected!');
});
// middleware
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

// Import router and assign to routes
var routes = require('./controllers/news_app_controller.js');

// use the get/post/update routes in news_app_controller.js
app.use('/', routes);

app.listen(PORT, function() {
    console.log('App listening on PORT ' + PORT);
});