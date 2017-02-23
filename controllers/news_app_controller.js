// var db = require('../models');

var express = require('express');
// call Router function on express and assign to var router to export on "router" file with all route paths
var router = express.Router();

router.get('/', function (req, res) {
    // Making a request call for the onion. The page's HTML is saved as callback's third argument
    request('https://techcrunch.com/crunch-network/', function (error, res, html) {
        // load the html into cheerio and save it to a var
        // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
        var $ = cheerio.load(html);

        // empty array to save the data that we'll scrape
        var result = [];

        // with cheerio, find each tag with div.story-container > h3 tag
        // i: iterator, element: the current element
        $('li.story-block').each(function (i, element) {

            // Save the text of the element (this) with child element with class 'story-container' in a title var
            var title = $(this).children('.story-container').children('h3').text();
            // Save the text of the element (this) with child element with class 'story-container' > 'story-byline' > a tag in a byline var
            var byline = $(this).children('.story-container').children('.story-byline').children('a').text();
            // In current element(this) look at its child elements with class 'story-container, then save the href attribute values in var link
            var link = $(this).children('.story-container').children('h3').children('a').attr('href');
            // In current element(this) look at its child elements with class of 'thumb', then save the image linke to var image.
            var image = $(this).children('.thumb').children('img').attr('src');

            //  Save these results in an object and push to the result array.
            result.push({
                title: title,
                byline: byline,
                link: link,
                image: image
            });

        });
        //  Log the result array of objects once cheerio analyzes each of its selected elements.
        console.log(result);
    });
    res.render('index', result);
});
