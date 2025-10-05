#!/usr/bin/env python3
"""
Exoplanet LLM API Server
FastAPI-based REST API for serving the trained exoplanet reasoning model
"""

import os
import json
import asyncio
from typing import Dict, List, Optional
from datetime import datetime
import torch
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForCausalLM
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ChatRequest(BaseModel):
    message: str
    temperature: float = 0.7
    max_tokens: int = 512
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
    """FastAPI server for exoplanet LLM"""
    
    def __init__(self, model_path: str):
        self.model_path = model_path
        self.model = None
        self.tokenizer = None
        self.conversations = {}
        self.model_info = {"model_name": "exoplanet-reasoning-llm", "version": "1.0.0"}
        
        self.app = FastAPI(
            title="Exoplanet Reasoning LLM API",
            description="API for interacting with specialized exoplanet reasoning language model",
            version="1.0.0"
        )
        
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
        
        self.setup_routes()
        
    async def load_model(self):
        """Load the model asynchronously"""
        try:
            logger.info(f"Loading model from {self.model_path}")
            
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_path)
            self.model = AutoModelForCausalLM.from_pretrained(self.model_path)
            
            if self.tokenizer.pad_token is None:
                self.tokenizer.pad_token = self.tokenizer.eos_token
            
            logger.info("Model loaded successfully")
            
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            raise RuntimeError(f"Failed to load model: {e}")
    
    def generate_response(self, message: str, temperature: float = 0.7, 
                         max_tokens: int = 512, conversation_id: str = None) -> str:
        """Generate response from the model"""
        
        if self.model is None:
            raise HTTPException(status_code=503, detail="Model not loaded")
        
        history = self.conversations.get(conversation_id, [])
        
        prompt = ""
        for turn in history[-3:]:
            prompt += f"Human: {turn['human']}\nAssistant: {turn['assistant']}\n"
        prompt += f"Human: {message}\nAssistant: "
        
        inputs = self.tokenizer(prompt, return_tensors="pt", truncation=True, max_length=1536)
        
        with torch.no_grad():
            outputs = self.model.generate(
                **inputs,
                max_new_tokens=max_tokens,
                temperature=temperature,
                do_sample=True,
                pad_token_id=self.tokenizer.eos_token_id,
                eos_token_id=self.tokenizer.eos_token_id,
                repetition_penalty=1.1
            )
        
        full_response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        response = full_response[len(prompt):].strip()
        
        if conversation_id:
            if conversation_id not in self.conversations:
                self.conversations[conversation_id] = []
            self.conversations[conversation_id].append({
                "human": message,
                "assistant": response,
                "timestamp": datetime.now().isoformat()
            })
        
        return response
    
    def setup_routes(self):
        """Setup API routes"""
        
        @self.app.on_event("startup")
        async def startup_event():
            await self.load_model()
        
        @self.app.get("/health", response_model=HealthResponse)
        async def health_check():
            return HealthResponse(
                status="healthy" if self.model is not None else "loading",
                model_loaded=self.model is not None,
                gpu_available=torch.cuda.is_available()
            )
        
        @self.app.post("/chat", response_model=ChatResponse)
        async def chat(request: ChatRequest):
            try:
                conv_id = request.conversation_id or f"conv_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
                
                response = self.generate_response(
                    message=request.message,
                    temperature=request.temperature,
                    max_tokens=request.max_tokens,
                    conversation_id=conv_id
                )
                
                return ChatResponse(
                    response=response,
                    conversation_id=conv_id,
                    timestamp=datetime.now().isoformat(),
                    model_info=self.model_info
                )
                
            except Exception as e:
                logger.error(f"Error in chat endpoint: {e}")
                raise HTTPException(status_code=500, detail="Internal server error")
        
        @self.app.get("/")
        async def root():
            return {
                "message": "Exoplanet Reasoning LLM API",
                "version": "1.0.0",
                "endpoints": {
                    "chat": "/chat",
                    "health": "/health",
                    "docs": "/docs"
                }
            }

def main():
    import argparse
    import uvicorn
    
    parser = argparse.ArgumentParser(description="Start Exoplanet LLM API server")
    parser.add_argument("--model", type=str, required=True, help="Path to trained model")
    parser.add_argument("--host", type=str, default="0.0.0.0", help="Host to bind to")
    parser.add_argument("--port", type=int, default=8000, help="Port to bind to")
    
    args = parser.parse_args()
    
    server = ExoplanetLLMServer(args.model)
    
    print(f"🚀 Starting Exoplanet LLM API server...")
    print(f"📡 Server will be available at: http://{args.host}:{args.port}")
    print(f"📚 API documentation: http://{args.host}:{args.port}/docs")
    
    uvicorn.run(server.app, host=args.host, port=args.port)

if __name__ == "__main__":
    main()
