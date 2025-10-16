@echo off
echo.
echo ========================================
echo   DarkBet Quick Start Guide
echo ========================================
echo.
echo This script will help you get started with DarkBet deployment.
echo.
echo PREREQUISITES:
echo   - Node.js 18+ installed
echo   - MongoDB running (or Atlas connection string)
echo   - Testnet BNB in your wallet
echo   - .env file configured
echo.
pause
echo.
echo ========================================
echo   Step 1: Install Dependencies
echo ========================================
echo.
echo Installing contract dependencies...
cd contracts
call npm install --legacy-peer-deps
cd ..
echo.
echo Installing backend dependencies...
cd backend
call npm install
cd ..
echo.
echo ✅ Dependencies installed!
echo.
pause
echo.
echo ========================================
echo   Step 2: Compile Smart Contracts
echo ========================================
echo.
cd contracts
call npx hardhat compile
cd ..
echo.
echo ✅ Contracts compiled!
echo.
pause
echo.
echo ========================================
echo   Step 3: Run Contract Tests
echo ========================================
echo.
cd contracts
call npx hardhat test
cd ..
echo.
echo ✅ Tests complete! (36/40 should pass)
echo.
pause
echo.
echo ========================================
echo   Ready for Deployment!
echo ========================================
echo.
echo NEXT STEPS (Manual):
echo.
echo 1. Configure .env file:
echo    - Add DEPLOYER_PRIVATE_KEY (without 0x)
echo    - Add MONGODB_URI
echo    - Add other required variables
echo.
echo 2. Get testnet BNB:
echo    Visit: https://testnet.binance.org/faucet-smart
echo.
echo 3. Deploy contracts:
echo    cd contracts
echo    npm run deploy:testnet
echo.
echo 4. Start backend:
echo    cd backend
echo    npm run dev
echo.
echo 5. Start frontend:
echo    npm run dev
echo.
echo For detailed instructions, read:
echo    DEPLOYMENT_GUIDE.md
echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
pause

