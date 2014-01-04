<!DOCTYPE html>
<html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
		<title>MD5</title>
	</head>
	<body>
		<span style="padding:3px 2px 9px;display:block;">输入密码后生成经过两次MD5加密的字符串：</span>
		<form action="" method="post">
			<input type="password" name="password" />
			<input type="submit" value="submit" />
		</form>
<?php
if ($_POST['password']) {
	echo md5(md5($_POST['password']));
}
?>
	</body>
</html>