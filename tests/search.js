var Knewone = require('..');
var should = require('should');

describe('#Knewone', function() {
  describe('#Search', function() {
    it('Should return correct search results', function(done) {
      this.timeout(6000);

      Knewone.search({
        keyword: 'watch'
      }, function(err, results) {
        if (err)
          return done(err);

        done();
      });
    });
  });
});
