# -*- coding: utf-8 -*-

import os
import re
import time
import urllib
import binascii

# 设定对象

DZ_BASE_URL = 'http://bbs.example.com'    # Discuz X2.0 论坛基地址
UC_BASE_URL = 'http://uc.example.com'     # Discuz UCenter 基地址

DzConfig = {
    'encoding'          : 'utf-8',
    'login_url'         : DZ_BASE_URL + '/member.php?mod=logging&action=login&loginsubmit=yes&infloat=yes&lssubmit=yes&inajax=1',
    'avatar_token_url'  : DZ_BASE_URL + '/home.php?mod=spacecp&ac=avatar',
    'avatar_upload_url' : UC_BASE_URL + '/index.php?%s',
}

def report_discuz_config():
    global DZ_BASE_URL, UC_BASE_URL, DzConfig

    detail = ''
    for (k, v) in DzConfig.items():
        if k <> 'encoding':
            detail += '%s = %s\n' % (k, v, )

    return "来自aa65535的温馨提醒：\n"\
           "不要设置过大的头像以免影响版面而遭到管理员群殴\n"\
           "\n"\
           "论坛网页的字符编码：%s\n"\
           "Discuz  论坛基地址：%s\n"\
           "UCenter 系统基地址：%s\n"\
           "\n"\
           "详细配置：\n%s" % (DzConfig['encoding'], DZ_BASE_URL, UC_BASE_URL, detail, )

def load_discuz_config(path):
    global DZ_BASE_URL, UC_BASE_URL, DzConfig

    # 执行 cnt 的内容
    try:
        print u'载入配置文件 ...'
        dz = {
                'DZ_BASE_URL'   : DZ_BASE_URL,
                'UC_BASE_URL'   : UC_BASE_URL,
                'DzConfig'      : DzConfig,
            }
        execfile (path, {}, {
            'dz': dz,
        })

        # 更新配置
        DZ_BASE_URL = dz['DZ_BASE_URL']
        UC_BASE_URL = dz['UC_BASE_URL']
        DzConfig    = dz['DzConfig']
        print u'配置更新成功'
    except:
        print u'无法识别配置文件!'

if os.path.isfile('discuz.py'):
    print u'检测到配置文件'
    load_discuz_config('discuz.py')    # 读取配置文件


# 设定 POST 数据参数

# Post Data Builder
class DzPostData:

    def loginForm(self, username, password, questionid, answer):
        return {
            'username'      : username,
            'password'      : password,
            'questionid'    : questionid,
            'answer'        : answer,
            'loginsubmit'   : 'true',
            'quickforward'  : 'yes',
            'handlekey'     : 'ls',
        }

    def uploadAvatar(self, pic1, pic2, pic3):
        return {
            'avatar1'       : binascii.b2a_hex(pic1).upper(),
            'avatar2'       : binascii.b2a_hex(pic2).upper(),
            'avatar3'       : binascii.b2a_hex(pic3).upper(),
            'urlReaderTS'   : str(long(time.time())),
        }

    def uploadAvatarUrlQuery(self, tokens):
        return urllib.urlencode({
            'm'             : 'user',
            'inajax'        : '1',
            'a'             : 'rectavatar',
            'appid'         : tokens['appid'],
            'input'         : tokens['input'],   # 注意：这个值，经过测试，每次都是不一样的。
            'agent'         : tokens['agent'],
            'avatartype'    : 'virtual',
        })


DzPost = DzPostData()

# 检测返回值

# Return Value Tester
class DzResponseTester:

    def loginForm(self, response):
        if response.find('succeedhandle_ls') >= 0:
            return 1
        elif response.find('location_login') >= 0:
            return 2
        else:
            return 0

    def uploadAvatarToken(self, response):
        p = re.compile('''/camera.swf\?([^']+)''')
        m = p.search(response)
        if m:
            return m.group(1)
        else:
            return ''

    def uploadAvatar(self, response):
        return response.find('face success="1"') >= 0


DzTest = DzResponseTester()
