var cheerio = require('cheerio');
var debug = require('debug')('knewone');

module.exports = {
  url: '/',
  callback: function(err, res, html, next) {
    if (err || res.statusCode !== 200)
      return next(err || new Error('Network error: ' + res.statusCode), html);

    var $ = cheerio.load(html);
    var $nav = $('#nav_primary');
    var $dropdownList = $nav.find('li.dropdown ul.dropdown-menu');

    if (!$nav.length || !$dropdownList.length)
      return next(null, null);

    var results = [];

    $dropdownList.find('>li').each(function() {
      var baby = {};
      var $title = $(this).find('>a').eq(0);
      var $childrens = $(this).find('.dropdown-submenu');

      baby.url = $title.attr('href');
      baby.name = $title.find('em').text();

      if ($childrens.length) {
        baby.children = [];

        // Push mainnode's children
        $childrens.find('.category--secondary').each(function(){
          var child = {}
          child.name = $(this).find('h6 a').text();
          child.url = $(this).find('h6 a').attr('href');
          child.children = [];

          // Push subnode's children
          $(this).find('p a').each(function(){
            var text = $(this).text();
            if (text === '查看更多')
              return;

            child.children.push({
              name: text,
              url: $(this).attr('href')
            });
          })

          debug(child);
          baby.children.push(child);
        })
      }
  
      results.push(baby)
    });

    debug(results);
    return next(null, results);
  }
}