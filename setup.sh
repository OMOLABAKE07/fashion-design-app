#!/bin/bash

# Fashion Design App Setup Script

echo "🚀 Setting up Fashion Design App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js version ^20.19.0 || >=22.12.0"
    exit 1
fi

echo "✅ Node.js is installed"

# Check Node.js version
NODE_VERSION=$(node -v)
echo "✅ Node.js version: $NODE_VERSION"

# Setup backend
echo "🔧 Setting up backend..."
cd backend

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

# Check if installation was successful
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

echo "✅ Backend dependencies installed"

# Setup frontend
echo "🔧 Setting up frontend..."
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Check if installation was successful
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

echo "✅ Frontend dependencies installed"

echo "📋 Setup Instructions:"
echo "1. Create a MySQL database named 'fashion_design_db'"
echo "2. Configure your database credentials in backend/.env"
echo "3. Run 'npm run init-db' in the backend directory to initialize the database"
echo "4. Start the backend server with 'npm start' in the backend directory"
echo "5. Start the frontend with 'npm run dev' in the root directory"

echo "🎉 Setup completed successfully!"