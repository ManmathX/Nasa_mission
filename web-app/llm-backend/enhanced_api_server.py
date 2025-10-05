#!/usr/bin/env python3
"""
Enhanced Exoplanet Discovery API Server

Advanced FastAPI server that integrates the federated AI system
with comprehensive exoplanet analysis, real-time predictions,
interactive visualizations, and community features.
"""

import os
import sys
import json
import asyncio
import uuid
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
from pathlib import Path
import numpy as np
import pandas as pd

# Add the llm-training directory to sys.path for importing federated_ai_system
sys.path.append(str(Path(__file__).parent.parent.parent / "llm-training"))

from fastapi import FastAPI, HTTPException, File, UploadFile, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
from pydantic import BaseModel, Field
from starlette.websockets import WebSocket, WebSocketDisconnect
import logging

# Import our federated AI system
from federated_ai_system import FederatedAISystem, ExoplanetCandidate, ScientificCalculator

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Pydantic models for API requests/responses
class ExoplanetAnalysisRequest(BaseModel):
    star_id: str
    period: float = Field(..., description="Orbital period in days")
    depth: Optional[float] = Field(None, description="Transit depth")
    duration: Optional[float] = Field(None, description="Transit duration in hours")
    stellar_mass: Optional[float] = Field(None, description="Stellar mass in solar masses")
    stellar_radius: Optional[float] = Field(None, description="Stellar radius in solar radii")
    temperature: Optional[float] = Field(None, description="Stellar temperature in Kelvin")
    noise: Optional[float] = Field(0.00005, description="Noise level")
    discovery_method: Optional[str] = Field("transit", description="Detection method")

class ExoplanetAnalysisResponse(BaseModel):
    analysis_id: str
    prediction: float
    confidence: float
    consensus_strength: float
    classification: str
    explanation: Dict[str, Any]
    individual_results: Dict[str, Dict[str, float]]
    helper_weights: Dict[str, float]
    scientific_calculations: Dict[str, Any]
    timestamp: str

class FeedbackRequest(BaseModel):
    analysis_id: str
    is_correct: bool
    ground_truth: Optional[bool] = None
    user_notes: Optional[str] = None

class SystemStatusResponse(BaseModel):
    total_analyses: int
    total_feedback: int
    system_accuracy: float
    helper_count: int
    helper_statistics: Dict[str, Any]
    recent_consensus_scores: List[float]
    uptime: str

class VisualizationRequest(BaseModel):
    data_type: str = Field(..., description="Type of visualization: transit_curve, radial_velocity, system_overview")
    parameters: Dict[str, Any] = Field(..., description="Parameters specific to visualization type")

class CommunityContribution(BaseModel):
    user_id: str
    star_id: str
    contribution_type: str  # "validation", "new_candidate", "parameter_refinement"
    data: Dict[str, Any]
    confidence_rating: Optional[float] = None
    notes: Optional[str] = None

class ConnectionManager:
    """WebSocket connection manager for real-time updates"""
    
    def __init__(self):
        self.active_connections: List[WebSocket] = []
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"WebSocket connected. Total connections: {len(self.active_connections)}")
    
    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        logger.info(f"WebSocket disconnected. Total connections: {len(self.active_connections)}")
    
    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)
    
    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception as e:
                logger.error(f"Error broadcasting message: {e}")
                self.disconnect(connection)

class EnhancedExoplanetAPI:
    """Enhanced API server with federated AI and advanced features"""
    
    def __init__(self):
        self.federated_system = FederatedAISystem()
        self.calculator = ScientificCalculator()
        self.connection_manager = ConnectionManager()
        self.analysis_history = {}
        self.community_contributions = []
        self.start_time = datetime.now()
        
        # Initialize the federated AI system with specialized helpers
        self._initialize_ai_helpers()
        
        self.app = FastAPI(
            title="Enhanced Exoplanet Discovery API",
            description="Advanced API for AI-powered exoplanet discovery with federated learning, real-time analysis, and community features",
            version="2.0.0",
            docs_url="/docs",
            redoc_url="/redoc"
        )
        
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
        
        self._setup_routes()
    
    def _initialize_ai_helpers(self):
        """Initialize specialized AI helpers for the federated system"""
        self.federated_system.add_helper("transit_photometry_specialist", "transit")
        self.federated_system.add_helper("radial_velocity_expert", "radial_velocity")
        self.federated_system.add_helper("direct_imaging_analyzer", "imaging")
        self.federated_system.add_helper("general_purpose_detector", "general")
        self.federated_system.add_helper("habitable_zone_evaluator", "general")
        
        logger.info("🤖 Initialized federated AI system with 5 specialized helpers")
    
    def _setup_routes(self):
        """Setup all API routes"""
        
        @self.app.get("/")
        async def root():
            return {
                "message": "🌌 Enhanced Exoplanet Discovery API",
                "version": "2.0.0",
                "features": [
                    "Federated AI Analysis",
                    "Real-time Predictions",
                    "Interactive Visualizations", 
                    "Community Contributions",
                    "Scientific Calculations",
                    "WebSocket Support"
                ],
                "endpoints": {
                    "analyze": "/api/analyze",
                    "feedback": "/api/feedback",
                    "status": "/api/status",
                    "visualize": "/api/visualize",
                    "community": "/api/community",
                    "websocket": "/ws",
                    "docs": "/docs"
                }
            }
        
        @self.app.get("/health")
        async def health_check():
            return {
                "status": "healthy",
                "federated_system_ready": len(self.federated_system.helpers) > 0,
                "total_helpers": len(self.federated_system.helpers),
                "uptime": str(datetime.now() - self.start_time),
                "timestamp": datetime.now().isoformat()
            }
        
        @self.app.post("/api/analyze", response_model=ExoplanetAnalysisResponse)
        async def analyze_exoplanet(request: ExoplanetAnalysisRequest):
            """Analyze an exoplanet candidate using the federated AI system"""
            try:
                # Convert request to analysis data
                analysis_data = {
                    'star_id': request.star_id,
                    'period': request.period,
                    'depth': request.depth,
                    'duration': request.duration,
                    'stellar_mass': request.stellar_mass,
                    'stellar_radius': request.stellar_radius,
                    'temperature': request.temperature,
                    'noise': request.noise
                }
                
                # Remove None values
                analysis_data = {k: v for k, v in analysis_data.items() if v is not None}
                
                # Perform federated AI analysis
                result = self.federated_system.analyze_candidate(analysis_data)
                
                # Generate analysis ID
                analysis_id = str(uuid.uuid4())
                
                # Calculate scientific parameters
                scientific_calc = await self._calculate_scientific_parameters(analysis_data)
                
                # Determine classification
                classification = self._classify_candidate(result['prediction'], result['confidence'])
                
                # Store analysis for later reference
                self.analysis_history[analysis_id] = {
                    'request': analysis_data,
                    'result': result,
                    'timestamp': datetime.now(),
                    'scientific_calculations': scientific_calc
                }
                
                # Create response
                response = ExoplanetAnalysisResponse(
                    analysis_id=analysis_id,
                    prediction=result['prediction'],
                    confidence=result['confidence'],
                    consensus_strength=result['consensus_strength'],
                    classification=classification,
                    explanation=result['explanation'],
                    individual_results=result['individual_results'],
                    helper_weights=result['helper_weights'],
                    scientific_calculations=scientific_calc,
                    timestamp=datetime.now().isoformat()
                )
                
                # Broadcast to WebSocket connections
                await self.connection_manager.broadcast(
                    json.dumps({
                        "type": "new_analysis",
                        "analysis_id": analysis_id,
                        "star_id": request.star_id,
                        "prediction": result['prediction'],
                        "classification": classification
                    })
                )
                
                logger.info(f"✨ Completed analysis for {request.star_id}: {classification}")
                return response
                
            except Exception as e:
                logger.error(f"Error in analysis: {e}")
                raise HTTPException(status_code=500, detail=str(e))
        
        @self.app.post("/api/feedback")
        async def provide_feedback(request: FeedbackRequest):
            """Provide human feedback on an analysis"""
            try:
                if request.analysis_id not in self.analysis_history:
                    raise HTTPException(status_code=404, detail="Analysis not found")
                
                # Find the analysis in the federated system history
                analysis_index = None
                for i, analysis in enumerate(self.federated_system.aggregation_history):
                    stored_analysis = self.analysis_history[request.analysis_id]
                    if (analysis['input_data'].get('star_id') == stored_analysis['request'].get('star_id') and
                        abs((analysis['timestamp'] - stored_analysis['timestamp']).total_seconds()) < 60):
                        analysis_index = i
                        break
                
                if analysis_index is None:
                    raise HTTPException(status_code=404, detail="Analysis not found in federated system")
                
                # Provide feedback to the federated system
                self.federated_system.provide_human_feedback(
                    analysis_index, 
                    request.is_correct, 
                    request.ground_truth
                )
                
                # Store feedback
                stored_analysis = self.analysis_history[request.analysis_id]
                stored_analysis['feedback'] = {
                    'is_correct': request.is_correct,
                    'ground_truth': request.ground_truth,
                    'user_notes': request.user_notes,
                    'timestamp': datetime.now()
                }
                
                # Get updated system status
                status = self.federated_system.get_system_status()
                
                # Broadcast feedback update
                await self.connection_manager.broadcast(
                    json.dumps({
                        "type": "feedback_received",
                        "analysis_id": request.analysis_id,
                        "system_accuracy": status['system_accuracy'],
                        "total_feedback": status['total_feedback']
                    })
                )
                
                logger.info(f"📝 Feedback received for {request.analysis_id}: {'✅' if request.is_correct else '❌'}")
                
                return {
                    "message": "Feedback received and system updated",
                    "analysis_id": request.analysis_id,
                    "updated_system_accuracy": status['system_accuracy'],
                    "total_feedback_count": status['total_feedback']
                }
                
            except Exception as e:
                logger.error(f"Error processing feedback: {e}")
                raise HTTPException(status_code=500, detail=str(e))
        
        @self.app.get("/api/status", response_model=SystemStatusResponse)
        async def get_system_status():
            """Get current status of the federated AI system"""
            try:
                status = self.federated_system.get_system_status()
                uptime = str(datetime.now() - self.start_time)
                
                return SystemStatusResponse(
                    total_analyses=status['total_analyses'],
                    total_feedback=status['total_feedback'],
                    system_accuracy=status['system_accuracy'],
                    helper_count=status['helper_count'],
                    helper_statistics=status['helper_statistics'],
                    recent_consensus_scores=status['recent_consensus_scores'],
                    uptime=uptime
                )
                
            except Exception as e:
                logger.error(f"Error getting system status: {e}")
                raise HTTPException(status_code=500, detail=str(e))
        
        @self.app.post("/api/visualize")
        async def generate_visualization(request: VisualizationRequest):
            """Generate visualization data for exoplanet analysis"""
            try:
                if request.data_type == "transit_curve":
                    return await self._generate_transit_curve(request.parameters)
                elif request.data_type == "radial_velocity":
                    return await self._generate_radial_velocity_curve(request.parameters)
                elif request.data_type == "system_overview":
                    return await self._generate_system_overview(request.parameters)
                elif request.data_type == "helper_performance":
                    return await self._generate_helper_performance()
                else:
                    raise HTTPException(status_code=400, detail="Unsupported visualization type")
                    
            except Exception as e:
                logger.error(f"Error generating visualization: {e}")
                raise HTTPException(status_code=500, detail=str(e))
        
        @self.app.post("/api/community")
        async def submit_community_contribution(contribution: CommunityContribution):
            """Accept community contributions for citizen science"""
            try:
                contribution_id = str(uuid.uuid4())
                contribution_data = {
                    "id": contribution_id,
                    "user_id": contribution.user_id,
                    "star_id": contribution.star_id,
                    "contribution_type": contribution.contribution_type,
                    "data": contribution.data,
                    "confidence_rating": contribution.confidence_rating,
                    "notes": contribution.notes,
                    "timestamp": datetime.now().isoformat(),
                    "status": "pending_review"
                }
                
                self.community_contributions.append(contribution_data)
                
                # Broadcast to community
                await self.connection_manager.broadcast(
                    json.dumps({
                        "type": "community_contribution",
                        "contribution_id": contribution_id,
                        "star_id": contribution.star_id,
                        "contribution_type": contribution.contribution_type,
                        "user_id": contribution.user_id
                    })
                )
                
                logger.info(f"🌍 Community contribution received: {contribution_id}")
                
                return {
                    "message": "Community contribution received",
                    "contribution_id": contribution_id,
                    "status": "pending_review"
                }
                
            except Exception as e:
                logger.error(f"Error processing community contribution: {e}")
                raise HTTPException(status_code=500, detail=str(e))
        
        @self.app.get("/api/community")
        async def get_community_contributions():
            """Get community contributions"""
            return {
                "contributions": self.community_contributions[-50:],  # Last 50
                "total_contributions": len(self.community_contributions)
            }
        
        @self.app.get("/api/analyses")
        async def get_recent_analyses(limit: int = 20):
            """Get recent analyses"""
            recent_analyses = []
            for analysis_id, data in list(self.analysis_history.items())[-limit:]:
                recent_analyses.append({
                    "analysis_id": analysis_id,
                    "star_id": data['request'].get('star_id'),
                    "prediction": data['result']['prediction'],
                    "confidence": data['result']['confidence'],
                    "timestamp": data['timestamp'].isoformat(),
                    "has_feedback": 'feedback' in data
                })
            
            return {"analyses": recent_analyses}
        
        @self.app.websocket("/ws")
        async def websocket_endpoint(websocket: WebSocket):
            await self.connection_manager.connect(websocket)
            try:
                while True:
                    # Keep connection alive and handle incoming messages
                    data = await websocket.receive_text()
                    message = json.loads(data)
                    
                    if message.get("type") == "ping":
                        await websocket.send_text(json.dumps({"type": "pong"}))
                    
            except WebSocketDisconnect:
                self.connection_manager.disconnect(websocket)
        
        # Serve static files (if needed)
        # self.app.mount("/static", StaticFiles(directory="static"), name="static")
    
    async def _calculate_scientific_parameters(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate scientific parameters using the ScientificCalculator"""
        calculations = {}
        
        try:
            # Orbital distance calculation
            if 'period' in data and 'stellar_mass' in data:
                orbital_dist = self.calculator.orbital_distance(data['stellar_mass'], data['period'])
                calculations['orbital_distance_au'] = orbital_dist / 1.496e11  # Convert to AU
                calculations['orbital_distance_m'] = orbital_dist
            
            # Transit depth calculation
            if 'depth' in data:
                calculations['transit_depth'] = data['depth']
                if data['depth'] > 0:
                    # Estimate planet radius ratio
                    radius_ratio = np.sqrt(data['depth'])
                    calculations['planet_radius_ratio'] = radius_ratio
                    
                    # If stellar radius is known, calculate planet radius
                    if 'stellar_radius' in data:
                        stellar_radius_m = data['stellar_radius'] * 6.96e8  # Solar radii to meters
                        planet_radius_m = radius_ratio * stellar_radius_m
                        calculations['planet_radius_earth_radii'] = planet_radius_m / 6.371e6
                        calculations['planet_radius_m'] = planet_radius_m
            
            # Stellar luminosity calculation
            if 'stellar_radius' in data and 'temperature' in data:
                stellar_radius_m = data['stellar_radius'] * 6.96e8
                luminosity = self.calculator.stellar_luminosity(stellar_radius_m, data['temperature'])
                calculations['stellar_luminosity_watts'] = luminosity
                calculations['stellar_luminosity_solar'] = luminosity / 3.828e26  # Solar luminosities
            
            # Habitable zone estimation (simplified)
            if 'stellar_luminosity_solar' in calculations:
                L_star = calculations['stellar_luminosity_solar']
                inner_hz = 0.95 * np.sqrt(L_star)  # AU
                outer_hz = 1.37 * np.sqrt(L_star)  # AU
                calculations['habitable_zone_inner_au'] = inner_hz
                calculations['habitable_zone_outer_au'] = outer_hz
                
                # Check if planet is in habitable zone
                if 'orbital_distance_au' in calculations:
                    orbital_dist_au = calculations['orbital_distance_au']
                    in_hz = inner_hz <= orbital_dist_au <= outer_hz
                    calculations['in_habitable_zone'] = in_hz
            
            # Equilibrium temperature estimation
            if 'stellar_luminosity_solar' in calculations and 'orbital_distance_au' in calculations:
                L_star = calculations['stellar_luminosity_solar']
                a_au = calculations['orbital_distance_au']
                # Simplified equilibrium temperature (assuming Earth-like albedo)
                T_eq = 278 * (L_star / (a_au**2))**0.25  # Kelvin
                calculations['equilibrium_temperature_k'] = T_eq
                calculations['equilibrium_temperature_c'] = T_eq - 273.15
        
        except Exception as e:
            logger.warning(f"Error in scientific calculations: {e}")
            calculations['calculation_error'] = str(e)
        
        return calculations
    
    def _classify_candidate(self, prediction: float, confidence: float) -> str:
        """Classify an exoplanet candidate based on prediction and confidence"""
        if prediction > 0.8 and confidence > 0.7:
            return "Strong Exoplanet Candidate"
        elif prediction > 0.6 and confidence > 0.5:
            return "Likely Exoplanet"
        elif prediction > 0.4:
            return "Possible Exoplanet - Requires Validation"
        elif prediction > 0.2:
            return "Weak Signal - Likely False Positive"
        else:
            return "Not an Exoplanet"
    
    async def _generate_transit_curve(self, parameters: Dict[str, Any]):
        """Generate transit light curve data"""
        try:
            period = parameters.get('period', 10.0)
            depth = parameters.get('depth', 0.01)
            duration = parameters.get('duration', 4.0)
            
            # Generate time points around transit
            time_points = np.linspace(-duration, duration, 200)
            
            # Simple box-model transit
            flux = np.ones_like(time_points)
            in_transit = np.abs(time_points) < (duration / 2)
            flux[in_transit] = 1 - depth
            
            # Add some realistic noise
            noise_level = parameters.get('noise', 0.001)
            flux += np.random.normal(0, noise_level, len(flux))
            
            return {
                "type": "transit_curve",
                "time": time_points.tolist(),
                "flux": flux.tolist(),
                "parameters": {
                    "period": period,
                    "depth": depth,
                    "duration": duration,
                    "noise_level": noise_level
                }
            }
        
        except Exception as e:
            logger.error(f"Error generating transit curve: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    
    async def _generate_radial_velocity_curve(self, parameters: Dict[str, Any]):
        """Generate radial velocity curve data"""
        try:
            period = parameters.get('period', 365.0)
            amplitude = parameters.get('amplitude', 10.0)  # m/s
            
            # Generate time points over multiple periods
            time_points = np.linspace(0, 2 * period, 100)
            phase = 2 * np.pi * time_points / period
            
            # Simple sinusoidal RV curve
            rv = amplitude * np.sin(phase)
            
            # Add noise
            noise_level = parameters.get('noise', 2.0)
            rv += np.random.normal(0, noise_level, len(rv))
            
            return {
                "type": "radial_velocity_curve",
                "time": time_points.tolist(),
                "radial_velocity": rv.tolist(),
                "parameters": {
                    "period": period,
                    "amplitude": amplitude,
                    "noise_level": noise_level
                }
            }
        
        except Exception as e:
            logger.error(f"Error generating RV curve: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    
    async def _generate_system_overview(self, parameters: Dict[str, Any]):
        """Generate system overview visualization data"""
        try:
            analyses = list(self.analysis_history.values())[-100:]  # Last 100 analyses
            
            # Aggregate statistics
            predictions = [a['result']['prediction'] for a in analyses]
            confidences = [a['result']['confidence'] for a in analyses]
            consensus_scores = [a['result']['consensus_strength'] for a in analyses]
            
            return {
                "type": "system_overview",
                "total_analyses": len(self.analysis_history),
                "predictions_distribution": {
                    "values": predictions,
                    "bins": 20
                },
                "confidence_distribution": {
                    "values": confidences,
                    "bins": 20
                },
                "consensus_over_time": {
                    "values": consensus_scores,
                    "timestamps": [a['timestamp'].isoformat() for a in analyses]
                },
                "classification_counts": self._get_classification_counts()
            }
        
        except Exception as e:
            logger.error(f"Error generating system overview: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    
    async def _generate_helper_performance(self):
        """Generate AI helper performance visualization data"""
        try:
            status = self.federated_system.get_system_status()
            
            helper_names = []
            reliability_weights = []
            performance_history_lengths = []
            
            for helper_id, stats in status['helper_statistics'].items():
                helper_names.append(helper_id)
                reliability_weights.append(stats['reliability_weight'])
                performance_history_lengths.append(stats['performance_history_length'])
            
            return {
                "type": "helper_performance",
                "helper_names": helper_names,
                "reliability_weights": reliability_weights,
                "performance_history_lengths": performance_history_lengths,
                "system_accuracy": status['system_accuracy'],
                "recent_consensus_scores": status['recent_consensus_scores']
            }
        
        except Exception as e:
            logger.error(f"Error generating helper performance: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    
    def _get_classification_counts(self):
        """Get counts of different classifications"""
        classifications = {}
        for analysis in self.analysis_history.values():
            pred = analysis['result']['prediction']
            conf = analysis['result']['confidence']
            classification = self._classify_candidate(pred, conf)
            classifications[classification] = classifications.get(classification, 0) + 1
        return classifications

# Create the API instance
api = EnhancedExoplanetAPI()
app = api.app

def main():
    """Main function to run the server"""
    import uvicorn
    import argparse
    
    parser = argparse.ArgumentParser(description="Enhanced Exoplanet Discovery API Server")
    parser.add_argument("--host", type=str, default="0.0.0.0", help="Host to bind to")
    parser.add_argument("--port", type=int, default=8000, help="Port to bind to")
    parser.add_argument("--reload", action="store_true", help="Enable auto-reload for development")
    
    args = parser.parse_args()
    
    print("🌌 Starting Enhanced Exoplanet Discovery API Server")
    print("=" * 60)
    print(f"🚀 Server URL: http://{args.host}:{args.port}")
    print(f"📚 API Documentation: http://{args.host}:{args.port}/docs")
    print(f"🔄 Real-time WebSocket: ws://{args.host}:{args.port}/ws")
    print("=" * 60)
    print("Features:")
    print("  ✅ Federated AI Analysis")
    print("  ✅ Real-time Predictions")
    print("  ✅ Interactive Visualizations")
    print("  ✅ Community Contributions")
    print("  ✅ Scientific Calculations")
    print("  ✅ WebSocket Real-time Updates")
    print("=" * 60)
    
    uvicorn.run(
        "enhanced_api_server:app",
        host=args.host,
        port=args.port,
        reload=args.reload
    )

if __name__ == "__main__":
    main()