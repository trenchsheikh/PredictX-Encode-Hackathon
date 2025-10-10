@echo off
echo Setting up Node.js PATH...
set PATH=%PATH%;C:\Program Files\nodejs

echo.
echo Node.js version:
node --version

echo.
echo npm version:
npm --version

echo.
echo Starting BNBPredict development server...
echo Project will be available at: http://localhost:3000
echo.

cd /d "C:\bnbet"
npm run dev

pause

