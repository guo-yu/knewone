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
  search: require('./routes/search'),
  profile: require('./routes/profile'),
  things: require('./routes/things')
};
