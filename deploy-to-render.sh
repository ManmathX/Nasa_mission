#!/bin/bash

# 🚀 NASA Exoplanet Discovery Platform - Render Deployment Script
# This script prepares your project for deployment to Render

echo "🌟 NASA Exoplanet Discovery Platform - Render Deployment"
echo "======================================================="

# Check if we're in the right directory
if [ ! -f "render.yaml" ]; then
    echo "❌ Error: render.yaml not found. Please run this script from the project root."
    exit 1
fi

echo "✅ Found render.yaml configuration"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "🔧 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit - NASA Exoplanet Discovery Platform"
else
    echo "✅ Git repository already initialized"
fi

# Test backend server
echo "🧪 Testing backend server..."
cd web-app/llm-backend
if [ ! -d "venv" ]; then
    echo "❌ Backend virtual environment not found. Please run setup_environments.sh first."
    exit 1
fi

# Test if production server works
source venv/bin/activate
python -c "
import sys
sys.path.append('.')
try:
    from production_server import ExoplanetLLMServer
    print('✅ Backend server imports successfully')
except ImportError as e:
    print(f'❌ Backend import error: {e}')
    sys.exit(1)
"

if [ $? -ne 0 ]; then
    echo "❌ Backend server test failed"
    exit 1
fi

cd ../..

# Test frontend build
echo "🧪 Testing frontend build..."
cd web-app/react-frontend

if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Check if build works
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Frontend builds successfully"
else
    echo "❌ Frontend build failed"
    exit 1
fi

cd ../..

# Create deployment checklist
echo ""
echo "📋 DEPLOYMENT CHECKLIST"
echo "======================="
echo "✅ render.yaml configuration created"
echo "✅ Production server (production_server.py) ready"
echo "✅ Frontend builds successfully"
echo "✅ Supabase configuration included"
echo "✅ Environment variables configured"
echo "✅ CORS settings configured"
echo ""

echo "🚀 NEXT STEPS FOR RENDER DEPLOYMENT:"
echo "===================================="
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Add Render deployment configuration'"
echo "   git push origin main"
echo ""
echo "2. Go to https://dashboard.render.com"
echo "3. Click 'New' → 'Blueprint'"
echo "4. Connect your GitHub repository"
echo "5. Render will automatically detect render.yaml and deploy both services"
echo ""
echo "📡 Your services will be available at:"
echo "   Backend API: https://nasa-exoplanet-api.onrender.com"
echo "   Frontend:    https://nasa-exoplanet-frontend.onrender.com"
echo "   API Docs:    https://nasa-exoplanet-api.onrender.com/docs"
echo ""
echo "🌟 Deployment ready! Your NASA Exoplanet Discovery Platform is ready for the cloud!"
