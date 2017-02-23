// Dependencies:

var express = require('express');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var rp = require('request-promise');
mongoose.Promise = Promise;

var db = mongoose.connection;
// var db = require('...');
var app = express();

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
// app.use('/', routes);


app.get('/', function (req, res) {
// Making a request call for techcrunch. The page's HTML is saved as callback's third argument
var options = {
    uri: 'https://techcrunch.com/crunch-network/',
    transform: function (body) {
        return cheerio.load(body);
    }
};

rp(options).then(function ($) {
    // load the html into cheerio and save it to a var
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'


    // empty array to save the data that we'll scrape
    var result = [];

    // with cheerio, find each tag with div.story-container > h3 tag
    // i: iterator, element: the current element
    $('li.story-block').each(function(i, element) {

        // Save the text of the element (this) with child element with class 'story-container' in a title var
        var title = $(this).children('.story-container').children('h3').text();
        // Save the text of the element (this) with child element with class 'story-container' > 'story-byline' > a tag in a byline var
        var byline = $(this).children('.story-container').children('.story-byline').children('a').text();
        // In current element(this) look at its child elements with class 'story-container, then save the href attribute values in var link
        var link = $(this).children('.story-container').children('h3').children('a').attr('href');
        // In current element(this) look at its child elements with class of 'thumb', then save the image linke to var image.
        var img = $(this).children('.thumb').children('img').attr('src');

        //  Save these results in an object and push to the result array.
        result.push({
            title: title,
            byline: byline,
            link: link,
            img: img
        });

    });
    //  Log the result array of objects once cheerio analyzes each of its selected elements.
    console.log(result);
   
 res.render('index', result);

});
// request('https://techcrunch.com/crunch-network/', function(error, res, html) {
//     // load the html into cheerio and save it to a var
//     // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
//     var $ = cheerio.load(html);

//     // empty array to save the data that we'll scrape
//     var result = [];

//     // with cheerio, find each tag with div.story-container > h3 tag
//     // i: iterator, element: the current element
//     $('li.story-block').each(function(i, element) {

//         // Save the text of the element (this) with child element with class 'story-container' in a title var
//         var title = $(this).children('.story-container').children('h3').text();
//         // Save the text of the element (this) with child element with class 'story-container' > 'story-byline' > a tag in a byline var
//         var byline = $(this).children('.story-container').children('.story-byline').children('a').text();
//         // In current element(this) look at its child elements with class 'story-container, then save the href attribute values in var link
//         var link = $(this).children('.story-container').children('h3').children('a').attr('href');
//         // In current element(this) look at its child elements with class of 'thumb', then save the image linke to var image.
//         var image = $(this).children('.thumb').children('img').attr('src');

//         //  Save these results in an object and push to the result array.
//         result.push({
//             title: title,
//             byline: byline,
//             link: link,
//             image: image
//         });

//     });
//     //  Log the result array of objects once cheerio analyzes each of its selected elements.
//     console.log(result);
   
 
// });
//  res.render('index', result);
});

app.listen(PORT, function() {
    console.log('App listening on PORT ' + PORT);
});