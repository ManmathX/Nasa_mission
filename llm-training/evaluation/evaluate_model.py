#!/usr/bin/env python3
"""
Exoplanet LLM Evaluation Script
Comprehensive evaluation of model performance on exoplanet reasoning tasks
"""

import os
import json
import argparse
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from unsloth import FastLanguageModel
import numpy as np
from typing import List, Dict, Tuple
import re
from sklearn.metrics import accuracy_score
import matplotlib.pyplot as plt
import seaborn as sns

class ExoplanetEvaluator:
    """Evaluate exoplanet LLM performance"""
    
    def __init__(self, model_path: str, use_unsloth: bool = True):
        self.model_path = model_path
        self.use_unsloth = use_unsloth
        
        print("🤖 Loading model for evaluation...")
        self.load_model()
        print("✅ Model loaded successfully!")
        
        # Evaluation datasets
        self.factual_questions = self.create_factual_eval_set()
        self.reasoning_questions = self.create_reasoning_eval_set()
        self.scientific_keywords = [
            'transit', 'radial velocity', 'direct imaging', 'gravitational microlensing',
            'habitable zone', 'goldilocks zone', 'stellar flux', 'orbital period',
            'eccentricity', 'mass-radius relationship', 'atmospheric composition',
            'biosignature', 'spectroscopy', 'photometry', 'astrometry'
        ]
    
    def load_model(self):
        """Load model and tokenizer"""
        
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
            raise
    
    def create_factual_eval_set(self) -> List[Dict]:
        """Create factual knowledge evaluation set"""
        
        return [
            {
                "question": "What percentage of starlight does a typical exoplanet block during transit?",
                "correct_answer": "0.01-1%",
                "category": "detection_methods"
            },
            {
                "question": "Which space telescope discovered the most exoplanets using the transit method?",
                "correct_answer": "Kepler",
                "category": "instruments"
            },
            {
                "question": "What is the habitable zone also called?",
                "correct_answer": "Goldilocks zone",
                "category": "habitability"
            },
            {
                "question": "What causes the Doppler shift in the radial velocity method?",
                "correct_answer": "stellar wobble",
                "category": "detection_methods"
            },
            {
                "question": "What is the minimum mass threshold for gas giant formation?",
                "correct_answer": "10 Earth masses",
                "category": "planet_formation"
            }
        ]
    
    def create_reasoning_eval_set(self) -> List[Dict]:
        """Create reasoning evaluation set"""
        
        return [
            {
                "question": "Why are hot Jupiters easier to detect than Earth-like planets?",
                "key_points": ["larger size", "deeper transits", "shorter periods", "stronger signals"],
                "category": "comparative_reasoning"
            },
            {
                "question": "Explain why direct imaging of exoplanets is challenging.",
                "key_points": ["brightness contrast", "angular separation", "stellar glare", "atmospheric interference"],
                "category": "technical_challenges"
            },
            {
                "question": "How would you confirm that a transit signal represents a real exoplanet?",
                "key_points": ["follow-up observations", "radial velocity", "rule out false positives", "statistical validation"],
                "category": "scientific_method"
            }
        ]
    
    def generate_response(self, question: str, max_length: int = 256) -> str:
        """Generate model response"""
        
        prompt = f"Human: {question}\nAssistant: "
        
        inputs = self.tokenizer(prompt, return_tensors="pt", truncation=True, max_length=1536)
        
        if torch.cuda.is_available():
            inputs = {k: v.cuda() for k, v in inputs.items()}
        
        with torch.no_grad():
            outputs = self.model.generate(
                **inputs,
                max_new_tokens=max_length,
                temperature=0.3,  # Lower temperature for evaluation
                top_p=0.9,
                do_sample=True,
                pad_token_id=self.tokenizer.eos_token_id,
                eos_token_id=self.tokenizer.eos_token_id,
                repetition_penalty=1.1
            )
        
        full_response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        response = full_response[len(prompt):].strip()
        
        return response
    
    def evaluate_factual_knowledge(self) -> Dict:
        """Evaluate factual knowledge accuracy"""
        
        print("📚 Evaluating factual knowledge...")
        
        results = []
        correct = 0
        
        for item in self.factual_questions:
            response = self.generate_response(item["question"])
            
            # Simple keyword matching for evaluation
            is_correct = item["correct_answer"].lower() in response.lower()
            
            results.append({
                "question": item["question"],
                "response": response,
                "expected": item["correct_answer"],
                "correct": is_correct,
                "category": item["category"]
            })
            
            if is_correct:
                correct += 1
        
        accuracy = correct / len(self.factual_questions)
        
        return {
            "accuracy": accuracy,
            "correct": correct,
            "total": len(self.factual_questions),
            "results": results
        }
    
    def evaluate_reasoning_quality(self) -> Dict:
        """Evaluate reasoning quality"""
        
        print("🧠 Evaluating reasoning quality...")
        
        results = []
        total_score = 0
        
        for item in self.reasoning_questions:
            response = self.generate_response(item["question"], max_length=512)
            
            # Score based on key points mentioned
            points_mentioned = sum(1 for point in item["key_points"] 
                                 if point.lower() in response.lower())
            score = points_mentioned / len(item["key_points"])
            
            # Bonus for scientific terminology
            scientific_terms = sum(1 for term in self.scientific_keywords 
                                 if term.lower() in response.lower())
            terminology_bonus = min(scientific_terms * 0.1, 0.3)
            
            final_score = min(score + terminology_bonus, 1.0)
            total_score += final_score
            
            results.append({
                "question": item["question"],
                "response": response,
                "key_points": item["key_points"],
                "points_mentioned": points_mentioned,
                "score": final_score,
                "category": item["category"]
            })
        
        avg_score = total_score / len(self.reasoning_questions)
        
        return {
            "average_score": avg_score,
            "total_score": total_score,
            "max_possible": len(self.reasoning_questions),
            "results": results
        }
    
    def evaluate_response_quality(self) -> Dict:
        """Evaluate overall response quality metrics"""
        
        print("📊 Evaluating response quality...")
        
        test_questions = [
            "What is the transit method?",
            "How do we find habitable exoplanets?",
            "What are the challenges in exoplanet detection?"
        ]
        
        metrics = {
            "avg_length": 0,
            "scientific_terminology_usage": 0,
            "coherence_score": 0,
            "responses": []
        }
        
        total_length = 0
        total_scientific_terms = 0
        
        for question in test_questions:
            response = self.generate_response(question)
            
            # Length metrics
            word_count = len(response.split())
            total_length += word_count
            
            # Scientific terminology
            scientific_count = sum(1 for term in self.scientific_keywords 
                                 if term.lower() in response.lower())
            total_scientific_terms += scientific_count
            
            # Simple coherence check (presence of reasoning indicators)
            reasoning_indicators = ['because', 'therefore', 'thus', 'due to', 'as a result']
            coherence = sum(1 for indicator in reasoning_indicators 
                          if indicator in response.lower())
            
            metrics["responses"].append({
                "question": question,
                "response": response,
                "word_count": word_count,
                "scientific_terms": scientific_count,
                "coherence_indicators": coherence
            })
        
        metrics["avg_length"] = total_length / len(test_questions)
        metrics["scientific_terminology_usage"] = total_scientific_terms / len(test_questions)
        metrics["coherence_score"] = sum(r["coherence_indicators"] for r in metrics["responses"]) / len(test_questions)
        
        return metrics
    
    def run_full_evaluation(self) -> Dict:
        """Run complete evaluation suite"""
        
        print("🚀 Starting comprehensive evaluation...\n")
        
        # Run all evaluations
        factual_results = self.evaluate_factual_knowledge()
        reasoning_results = self.evaluate_reasoning_quality()
        quality_results = self.evaluate_response_quality()
        
        # Compile overall results
        overall_results = {
            "factual_accuracy": factual_results["accuracy"],
            "reasoning_quality": reasoning_results["average_score"],
            "avg_response_length": quality_results["avg_length"],
            "scientific_terminology": quality_results["scientific_terminology_usage"],
            "coherence_score": quality_results["coherence_score"],
            "detailed_results": {
                "factual": factual_results,
                "reasoning": reasoning_results,
                "quality": quality_results
            }
        }
        
        return overall_results
    
    def print_evaluation_summary(self, results: Dict):
        """Print evaluation summary"""
        
        print("\n" + "="*60)
        print("🎯 EXOPLANET LLM EVALUATION SUMMARY")
        print("="*60)
        
        print(f"📚 Factual Accuracy: {results['factual_accuracy']:.2%}")
        print(f"🧠 Reasoning Quality: {results['reasoning_quality']:.2%}")
        print(f"📝 Avg Response Length: {results['avg_response_length']:.1f} words")
        print(f"🔬 Scientific Terminology: {results['scientific_terminology']:.1f} terms/response")
        print(f"🔗 Coherence Score: {results['coherence_score']:.1f}")
        
        print("\n📊 Performance Breakdown:")
        print("-" * 30)
        
        # Factual results by category
        factual_by_category = {}
        for result in results["detailed_results"]["factual"]["results"]:
            category = result["category"]
            if category not in factual_by_category:
                factual_by_category[category] = {"correct": 0, "total": 0}
            factual_by_category[category]["total"] += 1
            if result["correct"]:
                factual_by_category[category]["correct"] += 1
        
        for category, stats in factual_by_category.items():
            accuracy = stats["correct"] / stats["total"]
            print(f"  {category}: {accuracy:.2%} ({stats['correct']}/{stats['total']})")
        
        print("\n🎯 Overall Performance: ", end="")
        overall_score = (results['factual_accuracy'] + results['reasoning_quality']) / 2
        if overall_score >= 0.8:
            print("🌟 Excellent")
        elif overall_score >= 0.6:
            print("✅ Good")
        elif overall_score >= 0.4:
            print("⚠️ Fair")
        else:
            print("❌ Needs Improvement")
        
        print(f"Overall Score: {overall_score:.2%}")

def main():
    parser = argparse.ArgumentParser(description="Evaluate exoplanet LLM")
    parser.add_argument("--model", type=str, required=True,
                       help="Path to model to evaluate")
    parser.add_argument("--use_unsloth", action="store_true", default=True,
                       help="Use Unsloth for faster inference")
    parser.add_argument("--output", type=str, default="evaluation_results.json",
                       help="Output file for detailed results")
    parser.add_argument("--verbose", action="store_true",
                       help="Print detailed results")
    
    args = parser.parse_args()
    
    # Initialize evaluator
    evaluator = ExoplanetEvaluator(args.model, args.use_unsloth)
    
    # Run evaluation
    results = evaluator.run_full_evaluation()
    
    # Print summary
    evaluator.print_evaluation_summary(results)
    
    # Save detailed results
    with open(args.output, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n💾 Detailed results saved to: {args.output}")
    
    if args.verbose:
        print("\n📋 Detailed Results:")
        print(json.dumps(results, indent=2))

if __name__ == "__main__":
    main()
