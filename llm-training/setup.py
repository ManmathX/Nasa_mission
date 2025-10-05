#!/usr/bin/env python3
"""
Exoplanet LLM Setup Script
Automated setup and installation for the exoplanet reasoning LLM project
"""

import os
import sys
import subprocess
import argparse
from pathlib import Path

def run_command(command, description=""):
    """Run a command and handle errors"""
    print(f"🔧 {description}")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"❌ Error in {description}: {e}")
        print(f"Error output: {e.stderr}")
        return None

def check_python_version():
    """Check if Python version is compatible"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8 or higher is required")
        sys.exit(1)
    print(f"✅ Python {version.major}.{version.minor}.{version.micro} detected")

def check_cuda():
    """Check CUDA availability"""
    try:
        import torch
        if torch.cuda.is_available():
            print(f"✅ CUDA available: {torch.cuda.get_device_name(0)}")
            print(f"   CUDA version: {torch.version.cuda}")
            return True
        else:
            print("⚠️ CUDA not available - will use CPU (slower training)")
            return False
    except ImportError:
        print("⚠️ PyTorch not installed yet - CUDA check will be done after installation")
        return False

def create_directories():
    """Create necessary directories"""
    directories = [
        "data/raw",
        "data/processed", 
        "outputs",
        "logs",
        "notebooks",
        "configs",
        "train",
        "scripts",
        "inference",
        "evaluation"
    ]
    
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
        print(f"📁 Created directory: {directory}")

def install_dependencies(use_cuda=True):
    """Install required dependencies"""
    
    print("📦 Installing dependencies...")
    
    # Install PyTorch with CUDA support if available
    if use_cuda:
        torch_command = "pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118"
    else:
        torch_command = "pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu"
    
    run_command(torch_command, "Installing PyTorch")
    
    # Install other requirements
    run_command("pip install -r requirements.txt", "Installing other dependencies")

def setup_git_hooks():
    """Setup git hooks for code quality"""
    
    if not os.path.exists(".git"):
        print("⚠️ Not a git repository - skipping git hooks setup")
        return
    
    # Create pre-commit hook
    hook_content = """#!/bin/bash
# Pre-commit hook for code quality
echo "Running pre-commit checks..."

# Check for large files
find . -size +50M -not -path "./.git/*" -not -path "./outputs/*" | head -5 | while read file; do
    echo "Warning: Large file detected: $file"
done

# Basic Python syntax check
python -m py_compile train/*.py scripts/*.py inference/*.py evaluation/*.py 2>/dev/null || {
    echo "❌ Python syntax errors detected"
    exit 1
}

echo "✅ Pre-commit checks passed"
"""
    
    hook_path = ".git/hooks/pre-commit"
    with open(hook_path, 'w') as f:
        f.write(hook_content)
    
    os.chmod(hook_path, 0o755)
    print("✅ Git pre-commit hook installed")

def create_sample_notebook():
    """Create a sample Jupyter notebook"""
    
    notebook_content = {
        "cells": [
            {
                "cell_type": "markdown",
                "metadata": {},
                "source": [
                    "# Exoplanet LLM Training Notebook\n",
                    "\n",
                    "This notebook demonstrates how to use the exoplanet LLM training pipeline.\n",
                    "\n",
                    "## Setup\n",
                    "First, let's import the necessary libraries and check our environment."
                ]
            },
            {
                "cell_type": "code",
                "execution_count": None,
                "metadata": {},
                "outputs": [],
                "source": [
                    "import torch\n",
                    "import sys\n",
                    "import os\n",
                    "\n",
                    "print(f\"Python version: {sys.version}\")\n",
                    "print(f\"PyTorch version: {torch.__version__}\")\n",
                    "print(f\"CUDA available: {torch.cuda.is_available()}\")\n",
                    "if torch.cuda.is_available():\n",
                    "    print(f\"CUDA device: {torch.cuda.get_device_name(0)}\")"
                ]
            },
            {
                "cell_type": "markdown",
                "metadata": {},
                "source": [
                    "## Data Preparation\n",
                    "Let's prepare the exoplanet dataset for training."
                ]
            },
            {
                "cell_type": "code",
                "execution_count": None,
                "metadata": {},
                "outputs": [],
                "source": [
                    "# Prepare dataset\n",
                    "!python scripts/prepare_dataset.py --output data/processed/"
                ]
            },
            {
                "cell_type": "markdown",
                "metadata": {},
                "source": [
                    "## Model Training\n",
                    "Now let's fine-tune our model on the exoplanet data."
                ]
            },
            {
                "cell_type": "code",
                "execution_count": None,
                "metadata": {},
                "outputs": [],
                "source": [
                    "# Fine-tune the model\n",
                    "!python train/finetune.py --model llama-3-8b-instruct --dataset data/processed/combined_dataset.json --max_steps 20"
                ]
            }
        ],
        "metadata": {
            "kernelspec": {
                "display_name": "Python 3",
                "language": "python",
                "name": "python3"
            },
            "language_info": {
                "name": "python",
                "version": "3.8.0"
            }
        },
        "nbformat": 4,
        "nbformat_minor": 4
    }
    
    import json
    with open("notebooks/exoplanet_llm_demo.ipynb", 'w') as f:
        json.dump(notebook_content, f, indent=2)
    
    print("✅ Sample notebook created: notebooks/exoplanet_llm_demo.ipynb")

def main():
    parser = argparse.ArgumentParser(description="Setup exoplanet LLM project")
    parser.add_argument("--no-cuda", action="store_true", 
                       help="Install CPU-only version of PyTorch")
    parser.add_argument("--skip-deps", action="store_true",
                       help="Skip dependency installation")
    parser.add_argument("--minimal", action="store_true",
                       help="Minimal setup (directories only)")
    
    args = parser.parse_args()
    
    print("🌟 Setting up Exoplanet LLM Training Environment")
    print("=" * 50)
    
    # Check Python version
    check_python_version()
    
    # Create directories
    create_directories()
    
    if not args.minimal:
        # Check CUDA
        cuda_available = not args.no_cuda and check_cuda()
        
        # Install dependencies
        if not args.skip_deps:
            install_dependencies(cuda_available)
        
        # Setup git hooks
        setup_git_hooks()
        
        # Create sample notebook
        create_sample_notebook()
    
    print("\n🎉 Setup completed successfully!")
    print("\n📋 Next steps:")
    print("1. Prepare dataset: python scripts/prepare_dataset.py")
    print("2. Fine-tune model: python train/finetune.py --model llama-3-8b-instruct --dataset data/processed/combined_dataset.json")
    print("3. Apply GRPO training: python train/grpo_reasoning.py --base_model outputs/finetuned_model")
    print("4. Chat with model: python inference/chat_complete.py --model outputs/grpo_model")
    print("5. Evaluate model: python evaluation/evaluate_model.py --model outputs/grpo_model")
    print("\n📚 Check out notebooks/exoplanet_llm_demo.ipynb for a guided tutorial!")

if __name__ == "__main__":
    main()
