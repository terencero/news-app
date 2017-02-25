// var db = require('../models');
var rp = require('request-promise');
var express = require('express');
// Snatches HTML from URLs
var request = require('request');
// scrapes HTML
var cheerio = require('cheerio');
// call Router function on express and assign to var router to export on "router" file with all route paths
var router = express.Router();

var Saved = require('../models/saved_news.js');

router.get('/', function (req, res) {
    var options = {
        uri: 'https://techcrunch.com/column/',
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
        $('div.block-content').each(function (i, element) {

            // Save the text of the element (this) with child element with class 'story-container' in a title var
            var title = $(this).children('.post-title').text();
            // Save the text of the element (this) with child element with class 'story-container' > 'story-byline' > a tag in a byline var
            var byline = $(this).children('.byline').children('a').text();
            // In current element(this) look at its child elements with class 'story-container, then save the href attribute values in var link
            var link = $(this).children('.post-title').children('a').attr('href');
            // In current element(this) look at its child elements with class of 'thumb', then save the image linke to var image.
            var excerpt = $(this).children('.excerpt').text();
            // Get the id for each story block under the div.block-content parent li node
            var articleId = $(this).parent('.river-block').attr('id');

            //  Save these results in an object and push to the result array.
            result.push({
                title: title,
                byline: byline,
                link: link,
                excerpt: excerpt,
                articleId: articleId
            });

        });
        //  Log the result array of objects once cheerio analyzes each of its selected elements.
        console.log(result);

        res.render('index', result);

    });
});

router.post('/submit', function(req, res) {
// save the articled when user clicks it's save button
    var newSavedArticle = new Saved(req.body);
    newSavedArticle.save(function(err, doc) {
        if (err) {
            res.send(err);
        } else {
            // send the saved document to the saveds collection in the db
            res.send(doc);
        }

    })
});

module.exports = router;