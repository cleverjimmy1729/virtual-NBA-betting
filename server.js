/* NBA虚拟投注实验室 - 本地服务器（node）
 * 作用：以 http://127.0.0.1 方式提供页面，使浏览器的跨域请求（ESPN数据接口）稳定可用
 * 启动后自动打开默认浏览器；关闭此窗口即停止服务器 */
"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const root = __dirname;
const FILEMAP = {
  "/": "NBA虚拟投注实验室.html",
  "/index.html": "NBA虚拟投注实验室.html",
  "/pack.json": "NBA赛程数据包.json"
};
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml"
};

function handler(req, res) {
  let p = req.url.split("?")[0].split("#")[0];
  try { p = decodeURIComponent(p); } catch (e) {}
  if (FILEMAP[p]) p = "/" + FILEMAP[p];
  const f = path.join(root, p);
  if (!f.startsWith(root)) { res.writeHead(403); return res.end("Forbidden"); }
  fs.readFile(f, function (err, data) {
    if (err) { res.writeHead(404); return res.end("Not found: " + p); }
    const ext = path.extname(f).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream", "Cache-Control": "no-cache" });
    res.end(data);
  });
}

const PORTS = [8137, 8138, 8139, 8140];
function tryListen(i) {
  if (i >= PORTS.length) { console.log("ERROR: no available port in 8137-8140"); process.exit(1); }
  const srv = http.createServer(handler);
  srv.on("error", function (e) {
    if (e.code === "EADDRINUSE") { console.log("Port " + PORTS[i] + " busy, trying next..."); tryListen(i + 1); }
    else { console.error(e); process.exit(1); }
  });
  srv.listen(PORTS[i], "127.0.0.1", function () {
    const url = "http://127.0.0.1:" + PORTS[i] + "/";
    console.log("=====================================================");
    console.log("  NBA Virtual Betting Lab is running at " + url);
    console.log("  Keep this window OPEN while using the app.");
    console.log("  Close this window to stop the server.");
    console.log("=====================================================");
    exec('start "" "' + url + '"');
  });
}
tryListen(0);
