#!/usr/bin/env python3
"""
Exoplanet Dataset Preparation Script
Processes raw astronomical data into training-ready format
"""

import os
import json
import argparse
import pandas as pd
from typing import Dict, List, Any
import requests
from pathlib import Path

class ExoplanetDatasetBuilder:
    """Build training datasets for exoplanet LLM"""
    
    def __init__(self):
        self.exoplanet_qa_pairs = [
            {
                "question": "What is the transit method for exoplanet detection?",
                "answer": "The transit method detects exoplanets by observing periodic dimming of a star's light as a planet passes in front of it. When an exoplanet transits across the face of its host star from our perspective, it blocks a small fraction of the star's light, causing a temporary decrease in brightness. This method is highly effective for detecting planets with orbital planes aligned with our line of sight and has been responsible for discovering thousands of exoplanets, including those found by the Kepler Space Telescope."
            },
            {
                "question": "How do we determine if an exoplanet is in the habitable zone?",
                "answer": "The habitable zone, also called the Goldilocks zone, is the region around a star where liquid water could exist on a planet's surface. We determine this by calculating the distance range where a planet receives enough stellar radiation to maintain temperatures between 0°C and 100°C. This depends on the star's luminosity, temperature, and the planet's atmospheric composition. For our Sun, the habitable zone extends roughly from 0.95 to 1.37 AU. However, factors like atmospheric greenhouse effects, planetary mass, and magnetic field strength also influence habitability."
            },
            {
                "question": "What is the radial velocity method?",
                "answer": "The radial velocity method, also known as the Doppler method, detects exoplanets by measuring the wobble of a star caused by gravitational interaction with orbiting planets. As a planet orbits its star, both objects orbit around their common center of mass (barycenter). This causes the star to move slightly toward and away from Earth, creating a Doppler shift in the star's spectral lines. By precisely measuring these periodic shifts in the star's spectrum, astronomers can determine the planet's orbital period, minimum mass, and orbital eccentricity."
            },
            {
                "question": "How do we study exoplanet atmospheres?",
                "answer": "Exoplanet atmospheres are studied primarily through spectroscopy during transits and eclipses. During a transit, starlight passes through the planet's atmosphere, and different molecules absorb specific wavelengths, creating absorption lines in the spectrum. During secondary eclipses (when the planet passes behind the star), we can measure the planet's thermal emission. Space telescopes like Hubble, Spitzer, and now James Webb Space Telescope have detected water vapor, methane, carbon dioxide, and other molecules in exoplanet atmospheres. Direct imaging of nearby exoplanets also allows atmospheric analysis."
            },
            {
                "question": "What evidence would suggest an exoplanet might harbor life?",
                "answer": "Potential biosignatures in exoplanet atmospheres include: 1) Oxygen and ozone, which on Earth are produced by photosynthesis, 2) Water vapor indicating liquid water potential, 3) Methane combined with oxygen (chemical disequilibrium), 4) Phosphine or ammonia in rocky planet atmospheres, 5) Seasonal variations in atmospheric composition suggesting biological cycles. However, we must be cautious of false positives - these molecules can also be produced by non-biological processes. The simultaneous detection of multiple biosignatures and the absence of obvious abiotic explanations would strengthen the case for life."
            },
            {
                "question": "What role does stellar metallicity play in planet formation?",
                "answer": "Stellar metallicity (the abundance of elements heavier than hydrogen and helium) significantly influences planet formation. Higher metallicity stars are more likely to host planets, especially gas giants, because metals provide the solid building blocks for planetary cores. The core accretion model suggests that rocky/icy cores must reach a critical mass (~10 Earth masses) to rapidly accrete gas and form giant planets. Metal-rich environments provide more solid material for core formation. However, the relationship is complex - very high metallicity might lead to different planetary architectures, and lower metallicity stars can still form smaller rocky planets."
            }
        ]
        
        self.reasoning_prompts = [
            "Explain step-by-step how gravitational microlensing can detect exoplanets.",
            "Walk through the process of confirming an exoplanet candidate from Kepler data.",
            "Analyze why hot Jupiters are easier to detect than Earth-like planets.",
            "Compare the advantages and limitations of different exoplanet detection methods.",
            "Explain how we can estimate the temperature and composition of an exoplanet.",
            "Describe the challenges in detecting potentially habitable exoplanets.",
            "Analyze the factors that make a star system likely to have planets.",
            "Explain how tidal locking affects the habitability of exoplanets.",
            "Describe the process of atmospheric escape in close-in exoplanets.",
            "Analyze how we might detect signs of life in exoplanet atmospheres."
        ]
    
    def create_qa_dataset(self) -> List[Dict[str, Any]]:
        """Create Q&A dataset for supervised fine-tuning"""
        
        dataset = []
        
        # Add base Q&A pairs
        for qa in self.exoplanet_qa_pairs:
            dataset.append({
                "messages": [
                    {"role": "user", "content": qa["question"]},
                    {"role": "assistant", "content": qa["answer"]}
                ],
                "category": "factual_qa"
            })
        
        # Add reasoning prompts (for GRPO training)
        for prompt in self.reasoning_prompts:
            dataset.append({
                "messages": [
                    {"role": "user", "content": prompt}
                ],
                "category": "reasoning_prompt"
            })
        
        return dataset
    
    def create_conversation_dataset(self) -> List[Dict[str, Any]]:
        """Create multi-turn conversation dataset"""
        
        conversations = [
            {
                "messages": [
                    {"role": "user", "content": "I'm interested in learning about exoplanet detection. Where should I start?"},
                    {"role": "assistant", "content": "Great question! Exoplanet detection is a fascinating field. I'd recommend starting with the three main detection methods: the transit method, radial velocity method, and direct imaging. Each has unique advantages and limitations. Would you like me to explain one of these methods in detail?"},
                    {"role": "user", "content": "Yes, please explain the transit method."},
                    {"role": "assistant", "content": "The transit method works by detecting the slight dimming of a star's light when a planet passes in front of it from our perspective. Imagine holding a coin in front of a flashlight - the coin blocks some light, making it appear dimmer. Similarly, when an exoplanet transits its star, it blocks a tiny fraction of starlight (typically 0.01-1%). By continuously monitoring star brightness and looking for these periodic dips, we can detect planets and determine their size, orbital period, and distance from the star."},
                    {"role": "user", "content": "How accurate is this method?"},
                    {"role": "assistant", "content": "The transit method is remarkably accurate for certain types of planets. It's most effective for large planets orbiting close to their stars, as they create deeper and more frequent transits. The Kepler Space Telescope used this method to discover over 2,600 confirmed exoplanets. However, it has limitations: we can only detect planets whose orbits are aligned with our line of sight (about 0.5% of all planetary systems), and it's biased toward finding short-period planets. Despite these limitations, it's been incredibly successful and remains one of our primary detection methods."}
                ],
                "category": "educational_conversation"
            }
        ]
        
        return conversations
    
    def save_datasets(self, output_dir: str):
        """Save all datasets to output directory"""
        
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)
        
        # Save Q&A dataset
        qa_dataset = self.create_qa_dataset()
        with open(output_path / "exoplanet_qa.json", "w") as f:
            json.dump(qa_dataset, f, indent=2)
        
        # Save conversation dataset
        conv_dataset = self.create_conversation_dataset()
        with open(output_path / "exoplanet_conversations.json", "w") as f:
            json.dump(conv_dataset, f, indent=2)
        
        # Save reasoning prompts for GRPO
        reasoning_only = [item for item in qa_dataset if item["category"] == "reasoning_prompt"]
        reasoning_prompts = [item["messages"][0]["content"] for item in reasoning_only]
        with open(output_path / "reasoning_prompts.json", "w") as f:
            json.dump(reasoning_prompts, f, indent=2)
        
        # Create combined dataset
        combined = qa_dataset + conv_dataset
        with open(output_path / "combined_dataset.json", "w") as f:
            json.dump(combined, f, indent=2)
        
        print(f"✅ Datasets saved to {output_dir}")
        print(f"📊 Q&A pairs: {len([x for x in qa_dataset if x['category'] == 'factual_qa'])}")
        print(f"🧠 Reasoning prompts: {len(reasoning_prompts)}")
        print(f"💬 Conversations: {len(conv_dataset)}")
        print(f"📁 Total examples: {len(combined)}")

def main():
    parser = argparse.ArgumentParser(description="Prepare exoplanet training datasets")
    parser.add_argument("--output", type=str, default="./data/processed",
                       help="Output directory for processed datasets")
    parser.add_argument("--input", type=str, default="./data/raw",
                       help="Input directory for raw data (optional)")
    
    args = parser.parse_args()
    
    print("🌟 Preparing exoplanet training datasets...")
    
    # Create dataset builder
    builder = ExoplanetDatasetBuilder()
    
    # Save datasets
    builder.save_datasets(args.output)
    
    print("🚀 Dataset preparation complete!")
    print(f"📁 Files saved to: {args.output}")
    print("\n📋 Next steps:")
    print("1. Review the generated datasets")
    print("2. Run fine-tuning: python train/finetune.py --dataset data/processed/combined_dataset.json")
    print("3. Apply GRPO training: python train/grpo_reasoning.py --base_model outputs/finetuned_model")

if __name__ == "__main__":
    main()
