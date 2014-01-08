# -*- coding: utf-8 -*-
import urllib
import urllib2
import cookielib

from config import DzConfig


# URL Decode 补充函数
def urldecode(query):
    d = {}
    a = query.split('&')
    for s in a:
        if s.find('='):
            k,v = map(urllib.unquote, s.split('='))
            d[k] = v

    return d

# HTTP 客户端
class HttpClient:
    # 启用 Cookies
    cookies = cookielib.CookieJar()
    opener  = urllib2.build_opener(urllib2.HTTPCookieProcessor(cookies))

    # 设置请求和相应的编码
    encoding = 'utf-8'
    prog_enc = 'utf-8'

    # 构造函数
    def __init__(self, encoding='utf-8'):
        self.encoding = encoding

    # 编码转换
    def _codec_from_prog(self, str):
        if self.encoding == self.prog_enc:
            return str
        return unicode(str, self.prog_enc).encode(self.encoding)

    def _codec_to_prog(self, str):
        if self.encoding == self.prog_enc:
            return str
        return unicode(str, self.encoding).encode(self.prog_enc)

    # 请求与响应
    def get(self, url, data={}, encoding=True):
        # 对 data 进行编码
        upload_data = None
        if encoding:
            upload_data = {}
            for k in data:
                k2 = self._codec_from_prog(k)
                upload_data[k2] = self._codec_from_prog(data[k])
        else:
            upload_data = data

        # 构造上传数据
        query_string = urllib.urlencode(upload_data)

        # 构造 url
        req_url = url
        if query_string <> '':
            if url.find('?') >= 0:
                req_url += '&' + query_string
            else:
                req_url += '?' + query_string

        # 打开
        h = self.opener.open(req_url)
        cnt = h.read()

        # 编码转换
        return self._codec_to_prog(cnt)

    def post(self, url, data, encoding=True):
        # 对 data 进行编码
        upload_data = None
        if encoding:
            upload_data = {}
            for k in data:
                k2 = self._codec_from_prog(k)
                upload_data[k2] = self._codec_from_prog(data[k])
        else:
            upload_data = data

        # 构造上传数据
        query_string = urllib.urlencode(upload_data)

        # 构造 url
        req_url = url

        # 打开
        h = self.opener.open(req_url, query_string)
        cnt = h.read()

        # 编码转换
        return self._codec_to_prog(cnt)

    def post_raw(self, url, data):
        # 构造 url
        req_url = url

        # 打开
        h = self.opener.open(req_url, data)
        cnt = h.read()

        # 编码转换
        return self._codec_to_prog(cnt)


# 默认客户端
DzClient = HttpClient(DzConfig['encoding'])
