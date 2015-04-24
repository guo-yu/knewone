var cheerio = require('cheerio');
var debug = require('debug')('knewone');

module.exports = {
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
      $counts.find('>a').each(function() {
        var type = $(this).attr('class')
        profile[type.replace('profile-', '')] = $(this).find('span.profile-link_count').text();
      });
    }

    debug(profile);

    return next(null, profile.name ? profile : null);
  }
}