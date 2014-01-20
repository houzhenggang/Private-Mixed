<?php
require_once './http.php';

for ($i = 1; $i < 52; $i++) {
	$cookie = './cookie/pbcookie'.$i.'.txt';
	http_post('http://i.pcbeta.com/home.php?mod=task&do=apply&id=53', $cookie);
	http_post('http://i.pcbeta.com/home.php?mod=task&do=draw&id=53', $cookie);
}
