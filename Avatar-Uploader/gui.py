# -*- coding: utf-8 -*-

# 导入模块
import sys
import traceback
import os

from core.auth   import *
from core.avatar import *
from core.config import report_discuz_config

from PyQt4.QtCore import *
from PyQt4.QtGui  import *

from core.ui import Ui_AvatarWindow


# 程序编码与系统编码的转换
sys_enc     = 'gb18030'
prog_enc    = 'utf-8'
def _T(str):
    if sys_enc == prog_enc:
        return str
    return unicode(str, prog_enc).encode(sys_enc)

def _P(str):
    if sys_enc == prog_enc:
        return str
    return unicode(str, sys_enc).encode(prog_enc)

# Avatar 窗口定义
class AvatarWindow(QMainWindow):

    # 翻译字符串
    def tr(self, str):
        return QApplication.translate("AvatarWindow", str, None, QApplication.UnicodeUTF8)

    def __init__(self, parent=None):
        # 初始化父类型
        super(AvatarWindow, self).__init__(parent)

        # 创建 UI
        self.file_dialog = None
        self.ui = Ui_AvatarWindow()
        self.ui.setupUi(self)

        # 显示当前配置
        self.ui.txtStatus.setPlainText(self.tr(report_discuz_config()))

    def query_for_file(self):
        # 检查文件对话框是否存在
        if self.file_dialog == None:
            self.file_dialog = QFileDialog(self, self.tr('打开图像文件'), QString(), \
                    self.tr('图片文件 (*.jpg *.jpeg *.gif *.png);;所有文件 (*.*)'))
            self.file_dialog.setFileMode(QFileDialog.ExistingFile)
            self.file_dialog.setViewMode(QFileDialog.Detail)
            self.file_dialog.setAcceptMode(QFileDialog.AcceptOpen)
        # 请求文件
        if (self.file_dialog.exec_()):
            return self.file_dialog.selectedFiles()[0]
        return None

    def exitTriggered(self):
        print '* AvatarWindow.exitTriggered'
        pass

    def upload(self):
        # 解析参数
        username    = unicode(self.ui.txtUser.text()).encode('UTF-8')
        password    = unicode(self.ui.txtPass.text()).encode('UTF-8')
        questionid  = unicode(self.ui.txtQues.currentIndex()).encode('UTF-8')
        answer      = unicode(self.ui.txtAnsw.text()).encode('UTF-8')
        a_path = (
            unicode(self.ui.txtAvatar1.text()).encode('UTF-8'),
            unicode(self.ui.txtAvatar2.text()).encode('UTF-8'),
            unicode(self.ui.txtAvatar3.text()).encode('UTF-8'),
        )
        self.clear_status()

        if username == '' or password == '':
            self.add_status('您尚未输入用户名和密码。')
            return

        # 读取头像
        av_to_load = ''
        avatars = []
        try:
            for a in a_path:
                if (a == ''):
                    self.add_status('您尚未提供所有头像文件。')
                    return
                av_to_load = a
                avatars.append(open(_T(a), 'rb').read())
        except:
            self.add_status('无法读取文件 %s。' % (av_to_load, ))
            return

        # 登陆论坛
        self.add_status('正在登录论坛 ...')
        DzLoginStatus = DzLogin(username, password, questionid, answer)
        if   DzLoginStatus == 0:
            self.add_status('无法登陆 Discuz 论坛：用户名或密码错误。')
            return
        elif DzLoginStatus == 2:
            self.add_status('无法登陆 Discuz 论坛：需要安全问题或验证码。')
            return
        else:
            self.add_status('以 %s 身份登陆论坛成功。' % (username, ))

        # 上传头像
        self.add_status('正在上传头像，请耐心等待 ...')
        if DzUploadAvatar(*avatars):
            self.add_status('上传头像成功。')
        else:
            self.add_status('上传头像失败：您是否上传了非图片文件？')

        # 登出论坛
        DzLogout()

    def uploadSumit(self):
        print '* AvatarWindow.uploadSumit'
        self.ui.btnUpload.setEnabled(False)
        self.upload()
        self.ui.btnUpload.setEnabled(True)

    def changeAvatar1(self):
        print '* AvatarWindow.changeAvatar1'
        path = self.query_for_file()
        if path <> None:
            self.ui.txtAvatar1.setText(path)

    def changeAvatar2(self):
        print '* AvatarWindow.changeAvatar2'
        path = self.query_for_file()
        if path <> None:
            self.ui.txtAvatar2.setText(path)

    def changeAvatar3(self):
        print '* AvatarWindow.changeAvatar3'
        path = self.query_for_file()
        if path <> None:
            self.ui.txtAvatar3.setText(path)

    def add_status(self, str):
        self.ui.txtStatus.appendPlainText(self.tr('%s\n' % ((str), )))
        QApplication.processEvents()

    def clear_status(self):
        self.ui.txtStatus.clear()


# Qt 主程序调用
if __name__ == "__main__":
    print _T('创建 QT 应用程序框架 ...')
    app = QApplication(sys.argv)

    print _T('建立主窗口 ...')
    f = AvatarWindow()
    f.show()
    # app.setMainWidget(f)
    app.exec_()

    print _T('正常退出')
