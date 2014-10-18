GitHub-Webhook
===

文件说明
---

 - `/usr/local/bin/webhook`: 可执行文件, 注意修改里面的 `WEB_DIR` 路径

 - `/usr/local/nginx/conf/nginx.conf`: nginx 的示例配置文件

 - `/usr/local/nginx/conf/nginx_auth`: nginx 的示例密码文件, 默认是 `user:pass`

使用说明
---

 1. 根据示例配置文件配置 nginx

 2. 编辑并以指定的用户执行 `/usr/local/bin/webhook`  
    `启动: /usr/local/bin/webhook`  
    `停止: /usr/local/bin/webhook stop`  

 3. 配置 GitHub 项目的 Webhook  
    `Payload URL: http://user:pass@host/webhook`

附加说明
---

 - `nginx_auth` 文件可以使用 `htpasswd -b -c nginx_auth user pass` 生成  
   也可以在线生成(必须为 Crypt 加密): http://tool.oschina.net/htpasswd  

 - 同样适用于其他 GIT Webhook 服务, 只需修改 `webhook` 文件中的 `GIT_UA`
