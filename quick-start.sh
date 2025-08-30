#!/bin/bash

echo "🚀 Portfolio Project Quick Start"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm found"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Run setup wizard
echo "🔧 Running setup wizard..."
npm run setup

if [ $? -ne 0 ]; then
    echo "❌ Setup failed. Please run manually: npm run setup"
    exit 1
fi

echo ""
echo "🎉 Setup complete! Next steps:"
echo "1. Start MongoDB (if using local)"
echo "2. Seed database: npm run db:seed:all"
echo "3. Start development: npm run dev"
echo "4. Visit: http://localhost:3000"
echo ""
echo "Happy coding! 🚀"
