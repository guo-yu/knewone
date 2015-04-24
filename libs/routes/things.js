var cheerio = require('cheerio');
var debug = require('debug')('knewone');

module.exports = {
    url: '/things?page={{page|default(1)}}',
    callback: function(err, res, html, next) {
      if (err || res.statusCode !== 200)
        return next(err || new Error('Network error: ' + res.statusCode), html);

      var $ = cheerio.load(html);
      var results = [];

      $('.thing').each(function(){
        var baby = {};
        var $header = $(this).find('.cover');
        var $content = $(this).find('.content');
        var $info = $(this).find('.info');

        if ($header.length) {
          baby.cover = $header.find('img').attr('src')
        }

        if ($content.length) {
          baby.name = $content.find('.title a').text()
          baby.url = $content.find('.title a').attr('href')
        }

        if ($info.length) {
          baby.fanciers = $info.find('.fanciers_count').text()
          // Must signined.
          // baby.id = $info.find('.add_to_list').attr('data-thing-id')
        }

        results.push(baby)
      });

      debug(results);
      return next(null, results);
    }
  }