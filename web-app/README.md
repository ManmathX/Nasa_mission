# Exoplanet Web Application

An interactive web platform for exploring and analyzing exoplanet data with AI-powered insights.

## 🌟 Features

- **Interactive Visualizations**: Dynamic exploration of exoplanet data
- **Real-time Analysis**: AI-powered insights and classifications
- **Database Integration**: Supabase backend for data management
- **Modern UI**: Responsive React-based interface
- **RESTful API**: FastAPI backend for model integration
- **Authentication**: Secure user authentication and authorization

## 🏗️ Architecture

```
web-app/
├── react-frontend/           # Frontend application
│   ├── src/                 # Source code
│   ├── public/              # Static assets
│   └── package.json         # Dependencies
│
├── llm-backend/             # Backend API server
│   ├── app.py              # Main FastAPI application
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   └── requirements.txt    # Python dependencies
│
├── COMPLETE_SUPABASE_SCHEMA.sql    # Complete database schema
├── database_schema.sql              # Base schema
└── SUPABASE_SETUP.md               # Database setup guide
```

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- Python 3.8+
- Supabase account (for database)

### Backend Setup

```bash
cd llm-backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run the server
python app.py
```

The backend API will be available at `http://localhost:8000`

### Frontend Setup

```bash
cd react-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm start
```

The frontend will be available at `http://localhost:3000`

## 🗄️ Database Setup

### Supabase Configuration

1. Create a new project on [Supabase](https://supabase.com)
2. Run the SQL schemas in this order:
   - `database_schema.sql` - Base tables
   - `COMPLETE_SUPABASE_SCHEMA.sql` - Complete schema with all features

3. Configure your `.env` files with Supabase credentials:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   ```

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions.

## 🔌 API Endpoints

### Exoplanets
- `GET /api/exoplanets` - List all exoplanets
- `GET /api/exoplanets/{id}` - Get exoplanet details
- `POST /api/exoplanets` - Create new exoplanet
- `PUT /api/exoplanets/{id}` - Update exoplanet
- `DELETE /api/exoplanets/{id}` - Delete exoplanet

### Analysis
- `POST /api/analyze` - Analyze exoplanet data with AI
- `GET /api/predictions/{id}` - Get prediction results

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

## 🎨 Frontend Components

- **Dashboard**: Overview of exoplanet data
- **Explorer**: Interactive data exploration
- **Visualizations**: Charts and graphs
- **AI Analysis**: Real-time AI insights
- **Admin Panel**: Data management

## 🛠️ Technology Stack

### Frontend
- React 18
- React Router
- Axios
- Chart.js / D3.js
- CSS3 / Styled Components

### Backend
- FastAPI
- Python 3.8+
- Supabase Client
- Pydantic
- Uvicorn

### Database
- PostgreSQL (via Supabase)
- Real-time subscriptions
- Row-level security

## 🧪 Testing

### Backend Tests
```bash
cd llm-backend
pytest tests/
```

### Frontend Tests
```bash
cd react-frontend
npm test
```

## 📦 Deployment

### Backend Deployment
- Deploy to Heroku, Railway, or any Python hosting service
- Set environment variables
- Ensure database connectivity

### Frontend Deployment
- Build: `npm run build`
- Deploy to Vercel, Netlify, or any static hosting service
- Configure API endpoint

## 🔒 Security

- Authentication via JWT tokens
- Row-level security in Supabase
- CORS configuration
- Input validation
- SQL injection prevention

## 📖 Additional Documentation

- [Quick Start Guide](./QUICK_START.md)
- [Supabase Integration](./SUPABASE_INTEGRATION_COMPLETE.md)

## 🤝 Contributing

Contributions are welcome! Please follow the standard fork-and-pull request workflow.

## 📄 License

This project is licensed under the MIT License.
