var request = require('request');
var mails = {};
var dict = {};
var homeURL = 'http://www.mosigra.ru';
var limiter = 10;
var regMail = new RegExp('mailto:' + '[\\w.-]+@[\\w.-]+\\.\\w+', 'g');
var regUrl = new RegExp('<a href=[\'\"]' + homeURL + '[:/.A-z?<_&\s=>0-9;-]+[\'\"]', 'g');

findMails(homeURL);

function findMails(url) {
	limiter--;
	if (limiter > 0) {
		request(url, function (error, response, body) {
			dict[url] = true;
			var resMails = body.match(regMail).slice();
			var rawproperMails = [];
			for (var i = 0; i < resMails.length; i++) {
				rawproperMails[i] = resMails[i].slice(7);
			}
			for (var i = 0; i < resMails.length; i++) {
				mails[rawproperMails[i]] = true;
			}
			var urls = body.match(regUrl).slice();
			var properUrls = [];
			for (var i = 0; i < urls.length; i++) {
				properUrls[i] = urls[i].slice(9, -1);
			}
			for (var i = 0; i < properUrls.length; i++) {
				if (dict[properUrls[i]] == true) {
					continue;
				} else {
					findMails(properUrls[i]);
				} 
			}
		});
	} else {
		if (limiter == 0) {
			console.log(Object.keys(mails));
		}
	}
}