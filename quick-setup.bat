@echo off
echo 🔧 Quick Setup for BNB Prediction Platform
echo ==========================================

echo.
echo 📦 Adding Node.js to PATH...
set PATH=%PATH%;C:\Program Files\nodejs

echo.
echo 🧪 Testing Node.js...
"C:\Program Files\nodejs\node.exe" --version
if %errorlevel% neq 0 (
    echo ❌ Node.js not found! Please install from https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo 🧪 Testing npm...
"C:\Program Files\nodejs\npm.cmd" --version
if %errorlevel% neq 0 (
    echo ❌ npm not found!
    pause
    exit /b 1
)

echo.
echo 🚀 Starting development server...
npm run dev

pause
