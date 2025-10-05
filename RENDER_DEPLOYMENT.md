# 🚀 NASA Exoplanet Discovery Platform - Render Deployment Guide

## 📋 Prerequisites

1. **GitHub Repository**: Push your code to a GitHub repository
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **Domain (Optional)**: For custom domain setup

## 🎯 Quick Deploy to Render

### Option 1: Using render.yaml (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Add Render deployment configuration"
   git push origin main
   ```

2. **Deploy on Render**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml` and deploy both services

### Option 2: Manual Setup

#### Backend API Deployment

1. **Create Web Service**:
   - Go to Render Dashboard
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `nasa-exoplanet-api`
     - **Environment**: `Python 3`
     - **Build Command**: `cd web-app/llm-backend && pip install -r requirements-production.txt`
     - **Start Command**: `cd web-app/llm-backend && python production_server.py`
     - **Plan**: `Starter` (Free tier)

2. **Environment Variables**:
   ```
   PORT=8080
   ENVIRONMENT=production
   CORS_ORIGINS=*
   ```

#### Frontend Deployment

1. **Create Static Site**:
   - Click "New" → "Static Site"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `nasa-exoplanet-frontend`
     - **Build Command**: `cd web-app/react-frontend && npm ci && npm run build`
     - **Publish Directory**: `web-app/react-frontend/build`

2. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://nasa-exoplanet-api.onrender.com
   REACT_APP_ENVIRONMENT=production
   ```

## 🔧 Configuration Files

### Backend Requirements (`requirements-production.txt`)
```
fastapi>=0.100.0
uvicorn>=0.20.0
pydantic>=2.0.0
numpy>=1.24.0
pandas>=2.0.0
python-multipart>=0.0.6
python-dotenv>=1.0.0
```

### Frontend Package.json
- Already configured with proper build scripts
- Includes all necessary dependencies
- Proxy configuration for local development

## 🌐 API Endpoints

Once deployed, your API will be available at:
- **Base URL**: `https://nasa-exoplanet-api.onrender.com`
- **Health Check**: `/health`
- **API Docs**: `/docs`
- **Chat Endpoint**: `/api/chat`
- **Analysis Endpoint**: `/api/analyze`

### Example API Usage

```bash
# Health Check
curl https://nasa-exoplanet-api.onrender.com/health

# Chat with AI
curl -X POST https://nasa-exoplanet-api.onrender.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Tell me about exoplanets"}'

# Analyze Exoplanet
curl -X POST https://nasa-exoplanet-api.onrender.com/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "star_id": "Kepler-452",
    "period": 384.8,
    "depth": 0.00028,
    "stellar_mass": 1.04,
    "stellar_radius": 1.11,
    "temperature": 5757
  }'
```

## 🎨 Frontend Features

Your deployed frontend will include:
- **Interactive Formula Calculator**: Real-time exoplanet calculations
- **AI Chat Interface**: Conversational AI for exoplanet questions
- **Scientific Visualizations**: Charts and graphs for data analysis
- **Responsive Design**: Works on desktop and mobile
- **Modern UI**: Clean, professional space-themed interface

## 🔒 Security & Performance

### Production Optimizations
- **CORS Configuration**: Properly configured for cross-origin requests
- **Environment Variables**: Secure configuration management
- **Error Handling**: Comprehensive error responses
- **Logging**: Production-level logging configuration
- **Performance**: Optimized for cloud deployment

### Security Features
- Input validation with Pydantic models
- CORS protection
- Environment-based configuration
- No hardcoded secrets

## 📊 Monitoring & Maintenance

### Render Dashboard Features
- **Real-time Logs**: Monitor application logs
- **Metrics**: CPU, memory, and request metrics
- **Auto-deploys**: Automatic deployment on git push
- **Custom Domains**: Add your own domain
- **SSL Certificates**: Automatic HTTPS

### Health Monitoring
```bash
# Check API health
curl https://nasa-exoplanet-api.onrender.com/health

# Expected Response:
{
  "status": "healthy",
  "model_loaded": true,
  "gpu_available": false,
  "environment": "production"
}
```

## 🚀 Scaling & Upgrades

### Free Tier Limitations
- **Backend**: 512MB RAM, sleeps after 15 minutes of inactivity
- **Frontend**: Unlimited bandwidth, global CDN
- **Build Time**: 15 minutes max

### Upgrade Options
- **Starter Plan**: $7/month - No sleep, more resources
- **Standard Plan**: $25/month - Dedicated resources
- **Pro Plan**: $85/month - High performance

## 🛠️ Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check build logs in Render dashboard
   - Verify requirements.txt and package.json
   - Ensure Python version compatibility

2. **API Connection Issues**:
   - Verify REACT_APP_API_URL environment variable
   - Check CORS configuration
   - Confirm backend is running

3. **Frontend Not Loading**:
   - Check build command and publish directory
   - Verify all dependencies are installed
   - Check for JavaScript errors in browser console

### Debug Commands
```bash
# Test backend locally
cd web-app/llm-backend
python production_server.py

# Test frontend locally
cd web-app/react-frontend
npm start

# Build frontend for production
npm run build
```

## 🎉 Success Checklist

- [ ] Backend API deployed and responding to `/health`
- [ ] Frontend deployed and loading correctly
- [ ] API endpoints working (`/api/chat`, `/api/analyze`)
- [ ] Interactive formulas functioning
- [ ] Cross-origin requests working
- [ ] Environment variables configured
- [ ] Custom domain configured (optional)

## 🌟 Next Steps

1. **Custom Domain**: Add your own domain in Render settings
2. **Database Integration**: Add PostgreSQL for data persistence
3. **Authentication**: Implement user authentication
4. **Monitoring**: Set up error tracking and analytics
5. **CI/CD**: Configure automated testing and deployment

## 📞 Support

- **Render Documentation**: [render.com/docs](https://render.com/docs)
- **GitHub Issues**: Create issues in your repository
- **Community**: Join the Render community for support

---

**🌌 Your NASA Exoplanet Discovery Platform is now ready to explore the cosmos!**

**Live URLs**:
- **Frontend**: `https://nasa-exoplanet-frontend.onrender.com`
- **Backend API**: `https://nasa-exoplanet-api.onrender.com`
- **API Docs**: `https://nasa-exoplanet-api.onrender.com/docs`
