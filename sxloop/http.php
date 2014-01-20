<?php

function http_post($url = '', $cookie = false, $header = array(), $data = '') {
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_TIMEOUT, 5);
	curl_setopt($ch, CURLOPT_USERAGENT, '');
	if ($cookie) {
		curl_setopt($ch, CURLOPT_COOKIEFILE, $cookie);
	}
	curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
	$r = curl_exec($ch);
	curl_close($ch);
	return $r;
}

function http_get($url = '', $cookie = false, $header = array()) {
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_POST, 0);
	curl_setopt($ch, CURLOPT_TIMEOUT, 5);
	curl_setopt($ch, CURLOPT_USERAGENT, '');
	if ($cookie) {
		curl_setopt($ch, CURLOPT_COOKIEFILE, $cookie);
	}
	curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
	$r = curl_exec($ch);
	curl_close($ch);
	return $r;
}
