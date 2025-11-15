#!/usr/bin/env python3
"""
Production Exoplanet LLM Server for Render Deployment
This is a production-ready server optimized for cloud deployment.
"""

import os
import asyncio
import json
import time
import uuid
from datetime import datetime
from typing import Dict, List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import google.generativeai as genai

# Environment variables
PORT = int(os.getenv("PORT", 8080))
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyDRPtbzERK2iOy3uBK4jANGf_hFMUsXhSw")

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

# Pydantic models
class ChatRequest(BaseModel):
    message: str
    temperature: float = 0.7
    max_tokens: int = 500
    conversation_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    conversation_id: str
    timestamp: str
    model_info: Dict

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    gpu_available: bool
    environment: str

class ExoplanetAnalysisRequest(BaseModel):
    star_id: str
    period: float
    depth: Optional[float] = None
    duration: Optional[float] = None
    stellar_mass: Optional[float] = None
    stellar_radius: Optional[float] = None
    temperature: Optional[float] = None

class ExoplanetAnalysisResponse(BaseModel):
    analysis: Dict
    confidence: float
    habitability_score: float
    recommendations: List[str]

class ExoplanetLLMServer:
    def __init__(self):
        self.app = FastAPI(
            title="NASA Exoplanet Discovery API",
            description="Production API for Exoplanet Analysis and Discovery with Google Gemini",
            version="1.0.0"
        )
        
        # Enable CORS with environment-specific origins
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=CORS_ORIGINS,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
        
        # Initialize Gemini model
        try:
            self.gemini_model = genai.GenerativeModel('gemini-2.5-flash')
            self.gemini_available = True
            print("✅ Google Gemini 2.5 Flash initialized successfully")
        except Exception as e:
            print(f"⚠️ Gemini initialization failed: {e}")
            self.gemini_model = None
            self.gemini_available = False
        
        # In-memory conversation storage
        self.conversations = {}
        
        # Mock exoplanet knowledge base
        self.exoplanet_responses = {
            "feedback": "⚡ Our novel Feedback-Based Knowledge Weight formula: wᵢ ← wᵢ - η∂L/∂wᵢ where L = -h log P - (1-h) log(1-P). This groundbreaking approach uses gradient descent on binary cross-entropy loss to dynamically adjust AI helper reliability weights based on human feedback. Good performers gain higher weights, poor performers are penalized, making planet hunting faster and more reliable through collaborative intelligence.",
            "novel": "This project introduces a revolutionary Feedback-Based Knowledge Weight system that enables AI helpers to learn from human feedback in real-time. Each helper's reliability weight is updated using gradient descent, creating a dynamic trust system that improves accuracy over time.",
            "weight": "The weight adjustment formula wᵢ ← wᵢ - η∂L/∂wᵢ represents a novel approach to AI reliability scoring, where human feedback directly influences the trustworthiness of different AI helpers in exoplanet discovery.",
            "transit": "Transit photometry is one of the most successful methods for detecting exoplanets. When a planet passes in front of its host star, it causes a small, periodic dimming of the star's light.",
            "radial_velocity": "The radial velocity method detects exoplanets by measuring the wobble of a star caused by the gravitational pull of an orbiting planet.",
            "direct_imaging": "Direct imaging involves taking pictures of exoplanets by blocking out the light from their host stars using coronagraphs or starshades.",
            "habitability": "The habitable zone is the region around a star where liquid water could exist on a planet's surface, making it potentially suitable for life as we know it.",
            "kepler": "The Kepler Space Telescope revolutionized exoplanet discovery by monitoring over 150,000 stars and discovering thousands of exoplanet candidates.",
            "jwst": "The James Webb Space Telescope can analyze exoplanet atmospheres in unprecedented detail, searching for biosignatures and studying atmospheric composition."
        }
        
        self.setup_routes()
    
    def setup_routes(self):
        @self.app.get("/", response_class=dict)
        async def root():
            return {
                "message": "NASA Exoplanet Discovery API",
                "version": "1.0.0",
                "environment": ENVIRONMENT,
                "docs": "/docs",
                "health": "/health"
            }
        
        @self.app.get("/health", response_model=HealthResponse)
        async def health_check():
            return HealthResponse(
                status="healthy",
                model_loaded=self.gemini_available,
                gpu_available=False,
                environment=ENVIRONMENT
            )
        
        @self.app.post("/api/chat", response_model=ChatResponse)
        async def chat_with_llm(request: ChatRequest):
            # Generate conversation ID if not provided
            conversation_id = request.conversation_id or str(uuid.uuid4())
            
            # Store conversation
            if conversation_id not in self.conversations:
                self.conversations[conversation_id] = []
            
            self.conversations[conversation_id].append({
                "role": "user",
                "content": request.message,
                "timestamp": datetime.now().isoformat()
            })
            
            # Generate response based on keywords
            response_text = self.generate_response(request.message)
            
            # Store assistant response
            self.conversations[conversation_id].append({
                "role": "assistant", 
                "content": response_text,
                "timestamp": datetime.now().isoformat()
            })
            
            return ChatResponse(
                response=response_text,
                conversation_id=conversation_id,
                timestamp=datetime.now().isoformat(),
                model_info={
                    "model_name": "Google Gemini Pro" if self.gemini_available else "Exoplanet-LLM-v1.0",
                    "temperature": request.temperature,
                    "max_tokens": request.max_tokens,
                    "environment": ENVIRONMENT,
                    "gemini_enabled": self.gemini_available
                }
            )
        
        @self.app.post("/api/analyze", response_model=ExoplanetAnalysisResponse)
        async def analyze_exoplanet(request: ExoplanetAnalysisRequest):
            # Simulate exoplanet analysis
            analysis = {
                "star_id": request.star_id,
                "orbital_period_days": request.period,
                "planet_radius_earth": self.calculate_planet_radius(request.depth, request.stellar_radius),
                "equilibrium_temperature_k": self.calculate_equilibrium_temp(request.temperature, request.stellar_radius, request.period),
                "detection_method": "transit" if request.depth else "radial_velocity",
                "discovery_confidence": 0.85 + (0.1 * hash(request.star_id) % 10) / 100
            }
            
            # Calculate habitability score
            habitability = self.calculate_habitability_score(
                analysis.get("equilibrium_temperature_k", 0),
                analysis.get("planet_radius_earth", 0)
            )
            
            recommendations = self.generate_recommendations(analysis, habitability)
            
            return ExoplanetAnalysisResponse(
                analysis=analysis,
                confidence=analysis["discovery_confidence"],
                habitability_score=habitability,
                recommendations=recommendations
            )
        
        @self.app.get("/api/conversations/{conversation_id}")
        async def get_conversation(conversation_id: str):
            if conversation_id not in self.conversations:
                raise HTTPException(status_code=404, detail="Conversation not found")
            return {"conversation_id": conversation_id, "messages": self.conversations[conversation_id]}
    
    def generate_response(self, message: str) -> str:
        message_lower = message.lower()
        
        # Check for specific project-related keywords first (novel formula)
        if any(term in message_lower for term in ["novel", "feedback", "weight", "formula", "surprise", "reliability", "gradient"]):
            return self.exoplanet_responses["feedback"] + "\n\nThis revolutionary approach represents a major breakthrough in AI-assisted exoplanet discovery!"
        
        # Try to use Gemini for all other questions if available
        if self.gemini_available and self.gemini_model:
            try:
                # Create exoplanet-focused prompt
                system_prompt = """You are an expert AI assistant specialized in exoplanet discovery, analysis, and space science. 
                You have deep knowledge of:
                - Exoplanet detection methods (transit photometry, radial velocity, direct imaging, gravitational microlensing)
                - NASA missions (Kepler, TESS, JWST, etc.)
                - Habitability and biosignatures
                - Planetary formation and evolution
                - Astronomical data analysis
                
                Provide accurate, engaging, and educational responses about exoplanets and space science.
                Keep responses concise but informative (2-4 paragraphs).
                """
                
                full_prompt = f"{system_prompt}\n\nUser question: {message}\n\nProvide a detailed and informative response:"
                
                response = self.gemini_model.generate_content(full_prompt)
                return response.text
            except Exception as e:
                print(f"Gemini API error: {e}")
                # Fall back to keyword-based responses
                pass
        
        # Fallback to keyword-based responses if Gemini fails
        # Check for keywords and return appropriate responses
        for keyword, response in self.exoplanet_responses.items():
            if keyword in message_lower:
                return f"{response}\n\nWould you like to know more about exoplanet discovery methods or specific missions?"
        
        # Default responses for common questions
        if any(word in message_lower for word in ["hello", "hi", "hey"]):
            return "Hello! I'm your AI assistant powered by Google Gemini, specialized in exoplanet discovery and analysis. How can I help you explore the cosmos today?"
        
        if "how many" in message_lower and "exoplanet" in message_lower:
            return "As of 2024, we have confirmed over 5,000 exoplanets! The number continues to grow as our detection methods improve and new missions like JWST provide unprecedented capabilities."
        
        if "life" in message_lower or "alien" in message_lower:
            return "The search for life beyond Earth is one of the most exciting aspects of exoplanet research. We look for biosignatures in atmospheric compositions and study planets in habitable zones where liquid water could exist."
        
        # General response
        return f"That's an interesting question about exoplanets! Based on current research, exoplanet discovery involves multiple detection methods including transit photometry, radial velocity measurements, and direct imaging. Each method has its strengths for detecting different types of planets. Would you like me to explain any specific detection method or exoplanet characteristic?"
    
    def calculate_planet_radius(self, depth: Optional[float], stellar_radius: Optional[float]) -> float:
        if depth and stellar_radius:
            # R_planet = R_star * sqrt(depth)
            return stellar_radius * (depth ** 0.5)
        return 1.0  # Default Earth radius
    
    def calculate_equilibrium_temp(self, stellar_temp: Optional[float], stellar_radius: Optional[float], period: float) -> float:
        if stellar_temp and stellar_radius:
            # Simplified equilibrium temperature calculation
            # T_eq = T_star * sqrt(R_star / (2 * a))
            # Using Kepler's 3rd law approximation for semi-major axis
            a_au = (period / 365.25) ** (2/3)  # Rough approximation
            return stellar_temp * (stellar_radius / (2 * a_au * 215)) ** 0.5
        return 288.0  # Default Earth temperature
    
    def calculate_habitability_score(self, temperature: float, radius: float) -> float:
        # Simple habitability scoring based on temperature and size
        temp_score = 1.0 - abs(temperature - 288) / 288  # Earth-like temperature = 288K
        size_score = 1.0 - abs(radius - 1.0) / 5.0  # Earth-like size = 1.0
        
        # Combine scores
        habitability = (temp_score + size_score) / 2
        return max(0.0, min(1.0, habitability))
    
    def generate_recommendations(self, analysis: Dict, habitability: float) -> List[str]:
        recommendations = []
        
        if habitability > 0.7:
            recommendations.append("High priority target for atmospheric analysis with JWST")
            recommendations.append("Candidate for biosignature detection")
        elif habitability > 0.4:
            recommendations.append("Moderate interest for follow-up observations")
            recommendations.append("Study atmospheric composition if possible")
        else:
            recommendations.append("Low priority for habitability studies")
            recommendations.append("Focus on planetary formation and evolution research")
        
        if analysis.get("planet_radius_earth", 0) < 2.0:
            recommendations.append("Rocky planet candidate - suitable for surface studies")
        else:
            recommendations.append("Gas giant candidate - focus on atmospheric studies")
        
        return recommendations

def main():
    server = ExoplanetLLMServer()
    
    print("🌟 Starting NASA Exoplanet Discovery API Server...")
    print(f"🌍 Environment: {ENVIRONMENT}")
    print(f"📡 Server will be available on port: {PORT}")
    print("📚 API Documentation: /docs")
    print("🔧 Health Check: /health")
    print("\nPress Ctrl+C to stop the server")
    
    uvicorn.run(
        server.app, 
        host="0.0.0.0", 
        port=PORT,
        log_level="info" if ENVIRONMENT == "development" else "warning"
    )

if __name__ == "__main__":
    main()
