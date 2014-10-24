function rand_ip() {
	return [
		Math.floor(Math.random() * 225),
		Math.floor(Math.random() * 225),
		Math.floor(Math.random() * 225),
		Math.floor(Math.random() * 225)
	].join('.');
}

function in_domain(reg, url) {
	for (var i in reg) {
		if (reg[i].test(url)) {
			return true;
		}
	}
	return false;
}

function modifyHeader(headers, url) {
	var i, reg_r, reg_x, len, Append, Request = {};

	Append = {
		referer: false,
		forwarded: true,
	};

	reg_r = [
		/http:\/\/pan\.baidu\.com\/.*/
	];

	reg_x = [
		/https?:\/\/www\.re\/.*/,
		/https?:\/\/.+\.pcbeta\.com\/.*/
	];

	len = headers.length;

	for (i = 0; i < len; i++) {
		// console.log(headers[i].name + ': ' + headers[i].value);
		if (headers[i].name == 'Referer' && in_domain(reg_r, url)) {
			headers[i].value = url;
		}

		if (headers[i].name == 'X-Forwarded-For') {
			headers[i].value = rand_ip();
			Append.forwarded = false;
		}
	}

	if (Append.referer) {
		headers[len] = {
			name: 'Referer',
			value: url,
		};
		len++;
	}

	if (Append.forwarded && in_domain(reg_x, url)) {
		headers[len] = {
			name: 'X-Forwarded-For',
			value: rand_ip(),
		};
		len++;
	}

	Request.requestHeaders = headers;

	return Request;
}

chrome.webRequest.onBeforeSendHeaders.addListener(
	function(details) {
		// console.log('Request URL:', details.url);
		return modifyHeader(details.requestHeaders, details.url);
	},
	{
		urls: [ '<all_urls>' ],
	},
	[
		'requestHeaders',
		'blocking'
	]
);
