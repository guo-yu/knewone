var Knewone = require('..');

Knewone.categories(function(err, results) {
  if (err)
    return console.error(err);

  // name: '手包'
  var exampleCategory = results[0].children[0].children[0];
  console.log(exampleCategory);

  Knewone.things({
    url: exampleCategory.url
  }, function(err, finalResult){
    if (err)
      return console.error(err)
  })
});