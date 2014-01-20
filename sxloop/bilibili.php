<?php
require_once './http.php';

http_get(
	'http://interface.bilibili.tv/player?id=cid:110253&aid=271',
	false,
	array(
		'Cookie: DedeUserID=171508',
	)
);
