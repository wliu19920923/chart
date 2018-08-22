from PyQt5.QtWidgets import QApplication
from PyQt5.QtWebEngineWidgets import QWebEngineView
from PyQt5.QtCore import QObject, pyqtSlot, QUrl
from PyQt5.QtWebChannel import QWebChannel
import  requests
import json
import os

import socket

import codecs

from settings import BASE_DIR
from settings import WEB_SERVER_URL


class ActUser():
    def autoLogin(self):
        print('用户自动登录')
        try:
            with open(BASE_DIR + '/data/info.conf') as file:  # Use file to refer to the file object
                userdata = file.read()
                nowUser = json.loads(userdata)
                view.page().runJavaScript('autoLogin("' + nowUser['id'] + '","' + nowUser['token'] + '");')
        except IOError:
            return False


class CallHandler(QObject):
    @pyqtSlot(result = str)
    def myHello(self):
        #view.page().runJavaScript('uptext("hello, Python");')

        if os.path.exists(BASE_DIR + '/data/info.conf'):
            # 删除文件，可使用以下两种方法。
            os.remove(BASE_DIR + '/data/info.conf')
            #os.unlink(BASE_DIR + '/data/info.conf')

        print('call received')
        return 'hello, Python'

    @pyqtSlot(str)
    def jslog(self,log):
        print(log)

    @pyqtSlot(str,result=str)
    def Kline(self, qhcode):
        print('获取K线数据')
        f = requests.get('http://stock2.finance.sina.com.cn/futures/api/json.php/IndexService.getInnerFuturesDailyKLine?symbol=AU1806')
        #print(f.text)
        return  f.text

    @pyqtSlot(result=str)
    def loaded(self):
        #加载完毕 处理自动登录
        ActUser().autoLogin()


    @pyqtSlot(str)
    def loaduser(self,userdata):
        nowUser = json.loads(userdata)
        with open(BASE_DIR+'/data/info.conf', 'w+') as f:
            f.write(userdata)
        view.page().runJavaScript('setNowUser('+userdata+');')
        print('登录报单ws')
        view.page().runJavaScript('lj_sys_ws("' + nowUser['username'] + '","' + nowUser['password'] + '");')
        # outputFp = codecs.open(BASE_DIR+'/data/info.conf', 'w+');
        # outputFp.write(userdata);
        # outputFp.flush();
        # outputFp.close();

    @pyqtSlot(result=str)
    def logoutUser(self):
        if os.path.exists(BASE_DIR + '/data/info.conf'):
            # 删除文件，可使用以下两种方法。
            os.remove(BASE_DIR + '/data/info.conf')
            #os.unlink(BASE_DIR + '/data/info.conf')

        print('用户退出')
        return 'hello, Python'


if __name__ == '__main__':
    nowUser = {}
    app = QApplication([])
    view = QWebEngineView()

    channel = QWebChannel()
    handler = CallHandler()
    channel.registerObject('pyjs', handler)
    view.page().setWebChannel(channel)

    view.load(QUrl('file:///{0}/html/app.html'.format(BASE_DIR)))
    view.resize(1600,900)

    view.show()
    app.exec_()

# import requests
# import time
#
#
# def hi():
#     url = 'http://api-ropsten.etherscan.io/api?module=account&action=txlist&address=0xA778F9ae95252291186E5279d08361F09C75793c&startblock=0&endblock=99999999&sort=asc&apikey=621C8H4B9YNEZ6V1BDND2N5HN7VQJ5IWRT'
#     results = requests.get(url=url).json()['result']
#     print('results', results)
#
#
# if __name__ == '__main__':
#     for i in range(100):
#         hi()
#         time.sleep(1)