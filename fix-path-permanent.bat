@echo off
echo Adding Node.js to System PATH permanently...
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% == 0 (
    echo Running as Administrator - Good!
    echo.
) else (
    echo ERROR: This script must be run as Administrator!
    echo Right-click on this file and select "Run as administrator"
    pause
    exit /b 1
)

REM Add Node.js to system PATH
setx PATH "%PATH%;C:\Program Files\nodejs" /M

echo.
echo ✅ Node.js has been added to your system PATH!
echo.
echo Please close and reopen your terminal, then you can run:
echo   npm run dev
echo.
echo The change will take effect in new terminal windows.
echo.
pause

