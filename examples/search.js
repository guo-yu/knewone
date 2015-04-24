var Knewone = require('..');

Knewone.search({
  keyword: 'watch'
}, function(err, results) {
  if (err)
    return console.error(err);
});