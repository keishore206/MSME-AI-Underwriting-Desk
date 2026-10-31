@echo off
title MSME Underwriting Demo
echo.
echo  ============================================
echo   MSME Loan Underwriting Desk — AI Demo
echo  ============================================
echo.
echo  Starting local server on port 8080...
echo.

:: Open browser after 1 second
start "" /b cmd /c "timeout /t 1 /nobreak >nul && start http://localhost:8080"

:: Start Node.js server (blocks until Ctrl+C)
node "%~dp0server.js"

echo.
echo  Server stopped.
pause

