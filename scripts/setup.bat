@echo off
echo 🚀 Setting up BNBPredict...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Create .env.local if it doesn't exist
if not exist .env.local (
    echo 📝 Creating .env.local file...
    (
        echo # Privy Configuration
        echo NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here
        echo.
        echo # BNB Chain Configuration
        echo NEXT_PUBLIC_CHAIN_ID=56
        echo NEXT_PUBLIC_RPC_URL=https://bsc-dataseed.binance.org/
        echo.
        echo # Contract Addresses (to be deployed)
        echo NEXT_PUBLIC_VAULT_CONTRACT_ADDRESS=
        echo NEXT_PUBLIC_PREDICTION_CONTRACT_ADDRESS=
        echo.
        echo # AI API Configuration
        echo NEXT_PUBLIC_AI_API_URL=
        echo AI_API_KEY=
    ) > .env.local
    echo ✅ Created .env.local file. Please update with your actual values.
) else (
    echo ✅ .env.local already exists
)

REM Run build to check for errors
echo 🔨 Building project...
npm run build

if %errorlevel% equ 0 (
    echo ✅ Build successful!
    echo.
    echo 🎉 Setup complete! Next steps:
    echo 1. Update .env.local with your Privy app ID
    echo 2. Run 'npm run dev' to start the development server
    echo 3. Open http://localhost:3000 in your browser
    echo.
    echo 📚 For more information, see README.md
) else (
    echo ❌ Build failed. Please check the errors above.
    pause
    exit /b 1
)

pause


