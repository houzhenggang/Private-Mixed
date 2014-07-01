function rand_ip() {
	var ip = [
		Math.floor(Math.random() * 225),
		Math.floor(Math.random() * 225),
		Math.floor(Math.random() * 225),
		Math.floor(Math.random() * 225)
	];

	return ip.join('.');
}

function modifyHeader(headers, url) {
	var i, rip, len, Append, Request = {};

	Append = {
		referer: true,
		forwarded: true,
	};
	len = headers.length;
	rip = rand_ip();

	for (i = 0; i < len; i++) {
		// console.log(headers[i].name + ': ' + headers[i].value);
		if (headers[i].name == 'Referer') {
			headers[i].value = url;
			Append.referer = false;
		}

		if (headers[i].name == 'X-Forwarded-For') {
			headers[i].value = rip;
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

	if (Append.forwarded) {
		headers[len] = {
			name: 'X-Forwarded-For',
			value: rip
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
		urls: ['http://*/*', 'https://*/*']
	},
	[
		'requestHeaders',
		'blocking'
	]
);
