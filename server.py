# -*- coding: utf-8 -*-
# NBA虚拟投注实验室 - 本地服务器（python 备用版）
# 以 http://127.0.0.1 方式提供页面，使浏览器跨域请求（ESPN数据接口）稳定可用
import http.server
import socketserver
import webbrowser
import os
import sys

os.chdir(os.path.dirname(os.path.abspath(__file__)))

FILEMAP = {
    "/": "NBA虚拟投注实验室.html",
    "/index.html": "NBA虚拟投注实验室.html",
    "/pack.json": "NBA赛程数据包.json",
}


class Handler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        from urllib.parse import unquote
        p = unquote(path.split("?")[0].split("#")[0])
        if p in FILEMAP:
            return os.path.join(os.getcwd(), FILEMAP[p])
        return super().translate_path(path)

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()


port = 8137
while port < 8141:
    try:
        socketserver.TCPServer.allow_reuse_address = False
        httpd = socketserver.TCPServer(("127.0.0.1", port), Handler)
        url = "http://127.0.0.1:%d/" % port
        print("=====================================================")
        print("  NBA Virtual Betting Lab is running at " + url)
        print("  Keep this window OPEN while using the app.")
        print("  Close this window to stop the server.")
        print("=====================================================")
        webbrowser.open(url)
        httpd.serve_forever()
    except OSError:
        print("Port %d busy, trying next..." % port)
        port += 1
    finally:
        try:
            httpd.server_close()
        except Exception:
            pass
        break
