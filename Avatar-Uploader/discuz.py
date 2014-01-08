# -*- coding: utf-8 -*-

# 基本设置

encoding            = 'gbk'                            # Discuz 论坛网页编码
base_url            = 'http://bbs.example.com'         # Discuz X2.0 论坛基地址
ucenter_base_url    = 'http://uc.example.com'          # Discuz UCenter 基地址

# 更详细的配置(请小心更改)
dz['DZ_BASE_URL']   = base_url
dz['UC_BASE_URL']   = ucenter_base_url
dz['DzConfig'] = {
    'encoding'          : encoding,
    'login_url'         : base_url + '/member.php?mod=logging&action=login&loginsubmit=yes&infloat=yes&lssubmit=yes&inajax=1',
    'avatar_token_url'  : base_url + '/home.php?mod=spacecp&ac=avatar',
    'avatar_upload_url' : ucenter_base_url + '/index.php?%s',
}
