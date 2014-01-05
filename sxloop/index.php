<!DOCTYPE html>
<html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
		<title>两次MD5加密</title>
	</head>
	<body>
		<span style="padding:3px 2px 9px;display:block;">输入密码：</span>
		<form action="" method="post" name="md5">
			<input type="password" name="password" />
			<input type="submit" />
		</form>
<?php
if (isset($_POST['password'])) {
	echo md5(md5($_POST['password']));
}
?>
	</body>
</html>