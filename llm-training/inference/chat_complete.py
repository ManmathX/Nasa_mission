#!/usr/bin/env python3
"""
Exoplanet LLM Chat Interface
Interactive chat with the trained exoplanet reasoning model
"""

import os
import argparse
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from unsloth import FastLanguageModel
import json
from typing import List, Dict

class ExoplanetChatBot:
    """Interactive chat interface for exoplanet LLM"""
    
    def __init__(self, model_path: str, use_unsloth: bool = True):
        self.model_path = model_path
        self.use_unsloth = use_unsloth
        self.conversation_history = []
        
        print("🤖 Loading exoplanet reasoning model...")
        self.load_model()
        print("✅ Model loaded successfully!")
        
    def load_model(self):
        """Load the trained model and tokenizer"""
        
        try:
            if self.use_unsloth:
                self.model, self.tokenizer = FastLanguageModel.from_pretrained(
                    model_name=self.model_path,
                    max_seq_length=2048,
                    dtype=None,
                    load_in_4bit=True,
                )
                FastLanguageModel.for_inference(self.model)
            else:
                self.tokenizer = AutoTokenizer.from_pretrained(self.model_path)
                self.model = AutoModelForCausalLM.from_pretrained(
                    self.model_path,
                    torch_dtype=torch.float16,
                    device_map="auto"
                )
            
            if self.tokenizer.pad_token is None:
                self.tokenizer.pad_token = self.tokenizer.eos_token
                
        except Exception as e:
            print(f"Error loading model: {e}")
            print("Trying fallback loading method...")
            
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_path)
            self.model = AutoModelForCausalLM.from_pretrained(self.model_path)
    
    def format_conversation(self, user_input: str) -> str:
        """Format conversation for the model"""
        
        self.conversation_history.append({"role": "user", "content": user_input})
        
        prompt = ""
        for message in self.conversation_history:
            if message["role"] == "user":
                prompt += f"Human: {message['content']}\n"
            else:
                prompt += f"Assistant: {message['content']}\n"
        
        prompt += "Assistant: "
        return prompt
    
    def generate_response(self, user_input: str, max_length: int = 512, 
                         temperature: float = 0.7, top_p: float = 0.9) -> str:
        """Generate response from the model"""
        
        prompt = self.format_conversation(user_input)
        
        inputs = self.tokenizer(prompt, return_tensors="pt", truncation=True, max_length=1536)
        
        if torch.cuda.is_available():
            inputs = {k: v.cuda() for k, v in inputs.items()}
        
        with torch.no_grad():
            outputs = self.model.generate(
                **inputs,
                max_new_tokens=max_length,
                temperature=temperature,
                top_p=top_p,
                do_sample=True,
                pad_token_id=self.tokenizer.eos_token_id,
                eos_token_id=self.tokenizer.eos_token_id,
                repetition_penalty=1.1
            )
        
        full_response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        response = full_response[len(prompt):].strip()
        
        self.conversation_history.append({"role": "assistant", "content": response})
        
        return response
    
    def chat_loop(self):
        """Main chat loop"""
        
        print("\n🌟 Welcome to the Exoplanet Reasoning Assistant!")
        print("Ask me anything about exoplanets, detection methods, or astronomical phenomena.")
        print("Type 'quit', 'exit', or 'bye' to end the conversation.")
        print("Type 'clear' to clear conversation history.")
        print("Type 'save' to save the conversation.\n")
        
        while True:
            try:
                user_input = input("You: ").strip()
                
                if user_input.lower() in ['quit', 'exit', 'bye']:
                    print("👋 Goodbye! Keep exploring the cosmos!")
                    break
                
                elif user_input.lower() == 'clear':
                    self.conversation_history = []
                    print("🧹 Conversation history cleared.")
                    continue
                
                elif user_input.lower() == 'save':
                    self.save_conversation()
                    continue
                
                elif not user_input:
                    continue
                
                print("🤖 Assistant: ", end="", flush=True)
                response = self.generate_response(user_input)
                print(response)
                print()
                
            except KeyboardInterrupt:
                print("\n👋 Goodbye! Keep exploring the cosmos!")
                break
            except Exception as e:
                print(f"❌ Error generating response: {e}")
                print("Please try again with a different question.")
    
    def save_conversation(self):
        """Save conversation to file"""
        
        if not self.conversation_history:
            print("No conversation to save.")
            return
        
        filename = f"conversation_{len(os.listdir('.'))}.json"
        with open(filename, 'w') as f:
            json.dump(self.conversation_history, f, indent=2)
        
        print(f"💾 Conversation saved to {filename}")

def main():
    parser = argparse.ArgumentParser(description="Chat with exoplanet reasoning LLM")
    parser.add_argument("--model", type=str, required=True,
                       help="Path to trained model")
    parser.add_argument("--use_unsloth", action="store_true", default=False,
                       help="Use Unsloth for faster inference")
    parser.add_argument("--temperature", type=float, default=0.7,
                       help="Sampling temperature")
    parser.add_argument("--max_length", type=int, default=512,
                       help="Maximum response length")
    
    args = parser.parse_args()
    
    chatbot = ExoplanetChatBot(args.model, args.use_unsloth)
    chatbot.chat_loop()

if __name__ == "__main__":
    main()
