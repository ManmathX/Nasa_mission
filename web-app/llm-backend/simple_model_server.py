#!/usr/bin/env python3
"""
Simple Exoplanet LLM Server for Development
This is a mock server that simulates the LLM responses for development purposes.
"""

import asyncio
import json
import time
import uuid
from datetime import datetime
from typing import Dict, List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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

class ExoplanetLLMServer:
    def __init__(self):
        self.app = FastAPI(
            title="Exoplanet LLM API",
            description="API for Exoplanet Reasoning Large Language Model",
            version="1.0.0"
        )
        
        # Enable CORS
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
        
        self.conversations: Dict[str, List[Dict]] = {}
        self.setup_routes()
    
    def setup_routes(self):
        @self.app.get("/health", response_model=HealthResponse)
        async def health_check():
            return HealthResponse(
                status="healthy",
                model_loaded=True,
                gpu_available=False
            )
        
        @self.app.get("/model/info")
        async def get_model_info():
            return {
                "model_name": "Exoplanet Reasoning LLM (Mock)",
                "model_type": "CausalLM",
                "parameters": "7B",
                "status": "loaded",
                "capabilities": [
                    "exoplanet_discovery",
                    "scientific_reasoning",
                    "astronomical_calculations",
                    "habitability_assessment"
                ]
            }
        
        @self.app.post("/chat", response_model=ChatResponse)
        async def chat(request: ChatRequest):
            try:
                # Generate conversation ID if not provided
                conversation_id = request.conversation_id or str(uuid.uuid4())
                
                # Initialize conversation if new
                if conversation_id not in self.conversations:
                    self.conversations[conversation_id] = []
                
                # Add user message to conversation
                self.conversations[conversation_id].append({
                    "role": "user",
                    "content": request.message,
                    "timestamp": datetime.now().isoformat()
                })
                
                # Generate mock response based on input
                response = self.generate_mock_response(request.message)
                
                # Add assistant response to conversation
                self.conversations[conversation_id].append({
                    "role": "assistant",
                    "content": response,
                    "timestamp": datetime.now().isoformat()
                })
                
                return ChatResponse(
                    response=response,
                    conversation_id=conversation_id,
                    timestamp=datetime.now().isoformat(),
                    model_info={
                        "model_name": "Exoplanet Reasoning LLM (Mock)",
                        "temperature": request.temperature,
                        "max_tokens": request.max_tokens
                    }
                )
                
            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))
        
        @self.app.get("/")
        async def root():
            return {
                "message": "Exoplanet LLM API Server",
                "version": "1.0.0",
                "status": "running",
                "endpoints": {
                    "health": "/health",
                    "chat": "/chat",
                    "model_info": "/model/info",
                    "docs": "/docs"
                }
            }
    
    def generate_mock_response(self, message: str) -> str:
        """Generate a mock response based on the input message."""
        message_lower = message.lower()
        
        # Exoplanet discovery responses
        if any(word in message_lower for word in ["exoplanet", "planet", "discovery"]):
            return """Based on the latest exoplanet research, I can help you understand planetary discovery methods. 

**Transit Method**: This technique detects planets by measuring the slight dimming of a star when a planet passes in front of it. The Kepler Space Telescope used this method to discover thousands of exoplanets.

**Radial Velocity Method**: This detects planets by measuring the star's wobble caused by the gravitational pull of orbiting planets. It's particularly effective for finding massive planets close to their stars.

**Direct Imaging**: This method directly captures images of exoplanets, though it's challenging due to the brightness of the host star.

The James Webb Space Telescope is revolutionizing our understanding of exoplanet atmospheres and compositions. Would you like me to explain any specific aspect of exoplanet science in more detail?"""

        # Habitability responses
        elif any(word in message_lower for word in ["habitable", "life", "goldilocks", "zone"]):
            return """The habitable zone, also known as the Goldilocks zone, is the region around a star where liquid water could exist on a planet's surface.

**Key Factors for Habitability**:
- **Distance from star**: Must be within the habitable zone
- **Planetary mass**: Sufficient gravity to retain atmosphere
- **Atmospheric composition**: Presence of greenhouse gases
- **Magnetic field**: Protection from stellar radiation
- **Geological activity**: Plate tectonics for climate regulation

**Notable Habitable Zone Exoplanets**:
- **Proxima Centauri b**: Closest exoplanet in habitable zone
- **TRAPPIST-1 system**: Seven Earth-sized planets, three in habitable zone
- **Kepler-452b**: "Earth's cousin" - similar size and orbit

The search for biosignatures in exoplanet atmospheres is one of the most exciting areas of current research. Would you like to explore specific habitable zone calculations or atmospheric analysis techniques?"""

        # Scientific calculations
        elif any(word in message_lower for word in ["calculate", "formula", "equation", "math"]):
            return """I can help you with various astronomical calculations! Here are some key formulas:

**Kepler's Third Law**:
```
P² = (4π²a³) / (G(M₁ + M₂))
```
Where P is orbital period, a is semi-major axis, G is gravitational constant, and M are masses.

**Transit Depth**:
```
δ = (Rₚ/Rₛ)²
```
Where Rₚ is planet radius and Rₛ is star radius.

**Habitability Index**:
```
H = (1 - |a - aₕ|/aₕ) × (1 - |R - Rₑ|/Rₑ) × (1 - |M - Mₑ|/Mₑ)
```

**Doppler Shift (Radial Velocity)**:
```
v = c × (λ - λ₀)/λ₀
```

Would you like me to work through a specific calculation or explain any of these formulas in detail?"""

        # General astronomy
        elif any(word in message_lower for word in ["star", "stellar", "astronomy", "space"]):
            return """Astronomy is a fascinating field! I can help you understand various aspects of stellar and planetary science.

**Stellar Classification**:
- **O-type**: Hottest, most massive stars (>30,000K)
- **B-type**: Blue-white stars (10,000-30,000K)
- **A-type**: White stars (7,500-10,000K)
- **F-type**: Yellow-white stars (6,000-7,500K)
- **G-type**: Yellow stars like our Sun (5,200-6,000K)
- **K-type**: Orange stars (3,700-5,200K)
- **M-type**: Red dwarfs (<3,700K)

**Planetary Types**:
- **Terrestrial**: Rocky planets like Earth
- **Gas Giants**: Large planets with thick atmospheres
- **Ice Giants**: Planets with significant ice content
- **Super-Earths**: Planets 1-10 times Earth's mass

What specific aspect of astronomy would you like to explore? I can discuss stellar evolution, planetary formation, or observational techniques."""

        # Default response
        else:
            return """Hello! I'm the Exoplanet Reasoning LLM, specialized in planetary science and astronomical research.

I can help you with:
🔍 **Exoplanet Discovery**: Understanding detection methods and recent findings
🌍 **Habitability Analysis**: Assessing planetary conditions for life
📐 **Astronomical Calculations**: Working through formulas and equations
⭐ **Stellar Science**: Exploring star types and evolution
🌌 **Space Missions**: Discussing current and future exploration

What would you like to know about exoplanets or astronomy? Feel free to ask about specific planets, detection methods, or any space science topic!"""

def main():
    server = ExoplanetLLMServer()
    
    print("🌟 Starting Exoplanet LLM Mock Server...")
    print("📡 Server will be available at: http://localhost:8080")
    print("📚 API Documentation: http://localhost:8080/docs")
    print("🔧 Health Check: http://localhost:8080/health")
    print("\nPress Ctrl+C to stop the server")
    
    import uvicorn
    uvicorn.run(server.app, host="0.0.0.0", port=8080)

if __name__ == "__main__":
    main()
