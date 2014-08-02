function rand_ip() {
	var ip = [
		Math.floor(Math.random() * 225),
		Math.floor(Math.random() * 225),
		Math.floor(Math.random() * 225),
		Math.floor(Math.random() * 225)
	];

	return ip.join('.');
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
	var i, reg_f, reg_r, len, Append, Request = {};

	Append = {
		referer: true,
		forwarded: true,
	};
	len = headers.length;
	reg_f = [
		/https?:\/\/.+\.google\.com\/.*/
	];
	reg_r = [
		/https?:\/\/www\.re\/.*/,
		/https?:\/\/.+\.pcbeta\.com\/.*/
	];

	for (i = 0; i < len; i++) {
		// console.log(headers[i].name + ': ' + headers[i].value);
		if (headers[i].name == 'Referer') {

			if (in_domain(reg_f, headers[i].value)) {
				headers[i].value = url;
			}

			Append.referer = false;
		}

		if (headers[i].name == 'X-Forwarded-For') {
			headers[i].value = rand_ip();
			Append.forwarded = false;
		}
	}

	if (Append.referer) {
		headers[len] = {
			name: 'Referer',
			value: url
		};
		len++;
	}

	if (Append.forwarded && in_domain(reg_r, url)) {
		headers[len] = {
			name: 'X-Forwarded-For',
			value: rand_ip()
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
		urls: [ '<all_urls>' ]
	},
	[
		'requestHeaders',
		'blocking'
	]
);
