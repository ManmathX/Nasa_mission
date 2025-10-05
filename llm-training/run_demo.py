#!/usr/bin/env python3
"""
Exoplanet LLM Demo Runner
Complete demonstration of the trained exoplanet reasoning model
"""

import os
import sys
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

def check_model():
    """Check if trained model exists"""
    model_path = "./outputs/cpu_model"
    if os.path.exists(model_path):
        return model_path
    
    print("❌ No trained model found!")
    print("Please run training first:")
    print("  python3 train/cpu_finetune.py --dataset data/processed/combined_dataset.json")
    return None

def demo_model(model_path):
    """Demo the trained model"""
    print("🤖 Loading exoplanet reasoning model...")
    
    try:
        tokenizer = AutoTokenizer.from_pretrained(model_path)
        model = AutoModelForCausalLM.from_pretrained(model_path)
        
        if tokenizer.pad_token is None:
            tokenizer.pad_token = tokenizer.eos_token
        
        print("✅ Model loaded successfully!")
        
        # Test questions
        questions = [
            "What is the transit method for detecting exoplanets?",
            "How do we determine if an exoplanet is habitable?",
            "What are the main challenges in exoplanet detection?"
        ]
        
        print("\n🧪 Testing the model:")
        print("=" * 60)
        
        for i, question in enumerate(questions, 1):
            print(f"\n🔬 Question {i}: {question}")
            
            prompt = f"Human: {question}\nAssistant:"
            inputs = tokenizer.encode(prompt, return_tensors="pt")
            
            with torch.no_grad():
                outputs = model.generate(
                    inputs,
                    max_new_tokens=80,
                    temperature=0.7,
                    do_sample=True,
                    pad_token_id=tokenizer.eos_token_id
                )
            
            response = tokenizer.decode(outputs[0], skip_special_tokens=True)
            answer = response[len(prompt):].strip()
            
            # Clean up response
            if '\n' in answer:
                answer = answer.split('\n')[0]
            
            print(f"🤖 Response: {answer}")
            print("-" * 60)
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def show_project_status():
    """Show current project status"""
    print("📊 PROJECT STATUS")
    print("=" * 50)
    
    # Check components
    components = {
        "Dataset": "data/processed/combined_dataset.json",
        "Training Script": "train/cpu_finetune.py",
        "GRPO Script": "train/grpo_reasoning.py", 
        "Chat Interface": "inference/chat_complete.py",
        "API Server": "deployment/api_server.py",
        "Web Interface": "deployment/web_interface.html",
        "Trained Model": "outputs/cpu_model"
    }
    
    for name, path in components.items():
        status = "✅" if os.path.exists(path) else "❌"
        print(f"{status} {name}: {path}")
    
    print("\n" + "=" * 50)

def main():
    print("🌟 EXOPLANET LLM PROJECT DEMO")
    print("=" * 60)
    
    show_project_status()
    
    model_path = check_model()
    if model_path:
        print(f"\n🚀 Running model demo...")
        success = demo_model(model_path)
        
        if success:
            print("\n🎉 DEMO COMPLETED SUCCESSFULLY!")
            print("\n📋 Next Steps:")
            print("• Chat with model: python3 inference/chat_complete.py --model outputs/cpu_model")
            print("• Start API server: python3 deployment/api_server.py --model outputs/cpu_model")
            print("• Run evaluation: python3 evaluation/evaluate_model.py --model outputs/cpu_model")
            print("\n🌟 Your exoplanet reasoning LLM is ready!")
        else:
            print("\n❌ Demo failed - check model and dependencies")
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    main()
