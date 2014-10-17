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

 3. 配置 GitHub 项目的 Webhook, Payload URL: `http://user:pass@host/webhook`
