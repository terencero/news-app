$("#scrape").on('click', function () {

    // Making a request call for reddit's "webdev" board. The page's HTML is saved as the callback's third argument
    request('https://techcrunch.com/column/page/', function (error, response, html) {


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

            //  Save these results in an object and push to the result array.
            result.push({
                title: title,
                byline: byline,
                link: link,
                excerpt: excerpt
            });

        });
        //  Log the result array of objects once cheerio analyzes each of its selected elements.
        console.log(result);

        res.render('index', result);

    });
});
