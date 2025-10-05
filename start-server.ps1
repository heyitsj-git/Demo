Write-Host "Starting POP N' PLAN Server..." -ForegroundColor Green
Write-Host ""
Write-Host "Installing dependencies first..." -ForegroundColor Yellow
& "C:\Program Files\nodejs\npm.cmd" install
Write-Host ""
Write-Host "Starting server on http://localhost:5000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""
& "C:\Program Files\nodejs\node.exe" server.js
