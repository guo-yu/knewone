var cheerio = require('cheerio');
var debug = require('debug')('knewone');

// Request host
exports.host = 'https://www.knewone.com/';

// Request rules, contains request.headers
// `all` means this kind of rule will be append to request's option
// in both `GET`, `POST` ,`PUT`, `DELETE` methods.
exports.rules = {
  all: {
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, sdch',
      'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4,ja;q=0.2,de;q=0.2',
      'Host': 'www.knewone.com',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36',
      'X-Requested-With': 'XMLHttpRequest',
      'Referer': 'https://www.knewone.com'
    },
    gzip: true,
    json: false
  }
};

exports.routes = {
  search: {
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
  },
  profile: {
    url: '/users/{{userId}}/profile',
    callback: function(err, res, html, next) {
      if (err || res.statusCode !== 200)
        return next(err || new Error('Network error: ' + res.statusCode), html);

      var $ = cheerio.load(html);
      var $header = $('header');
      var $desc = $('.profile-description');
      var $actions = $('section.profile-actions');
      var $counts = $('footer.profile-links');
      var profile = {};

      if ($header.length) {
        profile.name = $header.find('.profile-name a').text();
        profile.gender = $header.find('.profile-gender').text() === '♀' ? 'female' : 'male';
        profile.avatar = $header.find(".profile-avatar img").attr('src');
      }

      if ($desc.length) 
        profile.description = $('.profile-description').text();

      if ($actions.length) 
        profile.followers = $actions.find('.profile-followers span').text()

      if ($counts.length) {
        $counts.find('>a').each(function(){
          var type = $(this).attr('class')
          profile[type.replace('profile-', '')] = $(this).find('span.profile-link_count').text();
        });
      }

      debug(profile);

      return next(null, profile.name ? profile : null);
    }
  }
}