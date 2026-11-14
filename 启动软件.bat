@echo off
title NBA Virtual Betting Lab - Local Server
cd /d "%~dp0"

rem ---- Option 1: Node.js from PATH ----
where node >nul 2>nul
if not errorlevel 1 (
  node "%~dp0server.js"
  goto :end
)

rem ---- Option 2: bundled Node.js (WorkBuddy) ----
if exist "C:\Users\uusta\.workbuddy\binaries\node\versions\22.22.2-6\node.exe" (
  "C:\Users\uusta\.workbuddy\binaries\node\versions\22.22.2-6\node.exe" "%~dp0server.js"
  goto :end
)

rem ---- Option 3: Python launcher ----
where py >nul 2>nul
if not errorlevel 1 (
  py "%~dp0server.py"
  goto :end
)

echo ============================================================
echo  [ERROR] This launcher needs Node.js or Python on this PC.
echo  Install one of them and run this file again:
echo    Node.js : https://nodejs.org
echo    Python  : https://python.org
echo  (Tip: WorkBuddy app users already have a bundled Node.js.)
echo ============================================================
pause

:end
echo.
echo Server stopped. You can close this window.
pause
