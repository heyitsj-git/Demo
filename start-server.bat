@echo off
echo Starting POP N' PLAN Server...
echo.
echo Installing dependencies first...
"C:\Program Files\nodejs\npm.cmd" install
echo.
echo Starting server on http://localhost:5000
echo.
"C:\Program Files\nodejs\node.exe" server.js
pause
