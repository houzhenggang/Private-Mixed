# -*- coding: utf-8 -*-

from client import DzClient, urldecode
from config import DzConfig, DzPost, DzTest

# 上传头像
def DzUploadAvatar(pic1, pic2, pic3):
    # 取得令牌数据
    cnt = DzClient.get(DzConfig['avatar_token_url'])
    tokens = DzTest.uploadAvatarToken(cnt)
    if tokens == '':
        return '无法取得头像上传令牌。'
    tokens = urldecode(tokens)

    # 取得上传 URL
    query  = DzPost.uploadAvatarUrlQuery(tokens)
    url    = DzConfig['avatar_upload_url'] % (query, )

    # 取得上传数据
    data = DzPost.uploadAvatar(pic1, pic2, pic3)

    # 执行操作
    cnt = DzClient.post(url, data, False)

    # 验证并返回
    return DzTest.uploadAvatar(cnt)
