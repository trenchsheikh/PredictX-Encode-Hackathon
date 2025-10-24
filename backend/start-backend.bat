@echo off
echo ========================================
echo   DarkBet Backend API
echo ========================================
echo.

cd %~dp0

echo Checking if node_modules exists...
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Starting backend server...
echo Backend will be available at http://localhost:3001
echo Press Ctrl+C to stop
echo.

call npm run dev

