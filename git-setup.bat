@echo off
echo 🚀 Setting up Git repository for BNB Prediction Platform
echo ========================================================

echo.
echo 📁 Adding Git to PATH...
set PATH=%PATH%;C:\Program Files\Git\bin

echo.
echo 🧹 Cleaning up existing git repository...
if exist .git (
    rmdir /s /q .git
)

echo.
echo 🔧 Initializing new git repository...
git init

echo.
echo 📝 Adding .gitignore...
git add .gitignore

echo.
echo 📦 Adding all project files (excluding node_modules)...
git add app/
git add components/
git add lib/
git add types/
git add public/
git add scripts/
git add *.json
git add *.js
git add *.ts
git add *.md
git add *.css
git add *.ps1
git add *.bat

echo.
echo 💾 Creating initial commit...
git commit -m "Initial commit: BNB-themed prediction market platform with Privy integration

Features:
- BNB-themed prediction market platform
- Responsive design with Tailwind CSS
- Interactive components from shadcn.io
- Mock Privy wallet integration
- Prediction market functionality
- User authentication flow
- Modern UI with animations
- TypeScript support
- Next.js 14 with App Router"

echo.
echo 🔗 Adding remote repository...
git remote add origin https://github.com/trenchsheikh/darkbet.git

echo.
echo 🌿 Setting main branch...
git branch -M main

echo.
echo 📤 Pushing to GitHub...
git push -u origin main

echo.
echo ✅ Repository setup complete!
echo 🌐 View your code at: https://github.com/trenchsheikh/darkbet
echo.
pause
