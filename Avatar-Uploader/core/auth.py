# -*- coding: utf-8 -*-

from client import DzClient, HttpClient
from config import DzConfig, DzPost, DzTest

# 登陆 Discuz 论坛
def DzLogin(username, password, questionid, answer):
    # 建立 POST 数据
    data = DzPost.loginForm(username, password, questionid, answer)

    # 执行登陆动作
    cnt = DzClient.post(DzConfig['login_url'], data)

    # 调试
    return DzTest.loginForm(cnt)

# 登出 Discuz 论坛
def DzLogout():
    # 偷懒做法：重建 DzClient 对象
    DzClient.cookies.clear()
