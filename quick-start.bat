@echo off
chcp 65001 >nul

echo 🚀 Portfolio Project Quick Start
echo ================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    echo    Visit: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm found
echo.

REM Install dependencies
echo 📦 Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed
echo.

REM Run setup wizard
echo 🔧 Running setup wizard...
npm run setup

if %errorlevel% neq 0 (
    echo ❌ Setup failed. Please run manually: npm run setup
    pause
    exit /b 1
)

echo.
echo 🎉 Setup complete! Next steps:
echo 1. Start MongoDB (if using local)
echo 2. Seed database: npm run db:seed:all
echo 3. Start development: npm run dev
echo 4. Visit: http://localhost:3000
echo.
echo Happy coding! 🚀
pause
