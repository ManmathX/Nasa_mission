#!/bin/bash

echo "🌌 Setting up NASA Exoplanet Discovery Platform environments..."

# Check if running from project root
if [ ! -f "README.md" ] || [ ! -d "llm-training" ] || [ ! -d "web-app" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "📦 Setting up LLM Training environment..."
cd llm-training

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "✅ Created Python virtual environment for LLM training"
else
    echo "✅ Python virtual environment already exists"
fi

# Activate virtual environment and install dependencies
source venv/bin/activate
echo "📥 Installing LLM training dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Create necessary directories
mkdir -p data/raw data/processed outputs
echo "📁 Created data and output directories"

cd ..

echo "🌐 Setting up Web Application backend..."
cd web-app/llm-backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "✅ Created Python virtual environment for web backend"
else
    echo "✅ Python virtual environment already exists"
fi

# Activate virtual environment and install dependencies
source venv/bin/activate
echo "📥 Installing backend dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

cd ../react-frontend

echo "⚛️ Setting up React frontend..."
if [ ! -d "node_modules" ]; then
    npm install
    echo "✅ Installed React frontend dependencies"
else
    echo "✅ React dependencies already installed"
fi

cd ../../

echo ""
echo "🎉 Environment setup complete!"
echo ""
echo "To get started:"
echo "1. LLM Training: cd llm-training && source venv/bin/activate"
echo "2. Backend: cd web-app/llm-backend && source venv/bin/activate && python api_server.py"
echo "3. Frontend: cd web-app/react-frontend && npm start"
echo ""
echo "🚀 Ready to discover exoplanets!"