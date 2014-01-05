<?php
// POST函数
function sxloop($array, $isvip = 0) {
	$times = 0;
	$host = !$isvip ? 'login3.reg2t.sandai.net' : 'loginvip.client.reg2t.sandai.net';
	for ($i = 0, $n = count($array); $i < $n; $i++) {
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $host);
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_TIMEOUT, 5);
		curl_setopt($ch, CURLOPT_USERAGENT, '');
		curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:', 'Connection:Close'));
		curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents($array[$i]));
		curl_exec($ch);
		curl_close($ch);
		$times++;
	}
	return $times;
}
// 获取文件
function getfile() {
	$files = array(array(), array());
	$current_dir = opendir('.');
	while(($file = readdir($current_dir)) !== false) {
		if (substr($file, -3) == 'bin') {
			$files[0][] = $file;
		}
		if (substr($file, -3) == 'vbi') {
			$files[1][] = $file;
		}
	}
	closedir($current_dir);
	return $files;
}

$files = getfile();
$count = 0;

$count += sxloop($files[0]);
$count += sxloop($files[1], 1);

echo $count;
