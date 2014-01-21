<?php
require_once './http.php';
// POST函数
function sxloop($array, $isvip = 0) {
	$times = 0;
	$host = !$isvip ? 'login3.reg2t.sandai.net' : 'loginvip.client.reg2t.sandai.net';
	for ($i = 0, $n = count($array); $i < $n; $i++) {
		http_post(
			$host,
			false,
			array(
				'Content-Type:', 'Connection:Close'
			),
			file_get_contents($array[$i])
		);
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

http_get(
	"http://pt.3g.qq.com/s?aid=nLogin3gqqbysid&3gqqsid=$sid",
	false,
	array(
		"Referer: http://q16.3g.qq.com/g/s?aid=nqqchatMain&sid=$sid&myqq=$qq"
	)
);

$files = getfile();
$count = 0;

$count += sxloop($files[0]);
$count += sxloop($files[1], 1);

echo $count;
