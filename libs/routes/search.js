var cheerio = require('cheerio');
var debug = require('debug')('knewone');

module.exports = {
    url: '/search?q={{keyword}}',
    callback: function(err, res, html, next) {
      if (err || res.statusCode !== 200)
        return next(err || new Error('Network error: ' + res.statusCode), html);

      var $ = cheerio.load(html);
      var results = {};

      $('section').each(function() {
        var sectionClass = $(this).attr('class');
        var result = results[sectionClass] = [];
        var $list = $(this).find('>ul').eq(0);

        if (!$list.length)
          return;

        $list.find('>li').each(function() {
          var baby = {};
          var $things = $(this).find('.search_thing');
          var $users = $(this).find('.search_user');

          // Things
          if ($things.length) {
            var stats = $things.find('ul.search_thing-counts');

            baby.name = $things.find('h6').text()
            baby.star = stats.find('li').eq(0).text() || 0;
            baby.own = stats.find('li').eq(1).text() || 0;
            baby.review = stats.find('li').eq(2).text() || 0;
            baby.thumbnail = $things.find('.search_thing-cover img').attr('src');
          }

          // User
          if ($users.length) {
            baby.id = $users.find('>a').attr('data-profile-popover');
            baby.name = $users.find('h6').text();
            baby.avatar = $users.find('img').attr('src')
          }

          // List or Topic
          if (sectionClass.indexOf('search_lists') > -1 || sectionClass.indexOf('search_topics') > -1) {
            baby.href = $(this).find('a').eq(0).attr('href');
            baby.name = $(this).find('a').eq(0).text();
          }

          if (!baby.name)
            return;

          result.push(baby);
        });
      });

      return next(null, results);
    }
  }