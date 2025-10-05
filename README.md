# NASA Mission - Exoplanet Discovery & Analysis Platform

A comprehensive platform for exoplanet discovery, classification, and scientific reasoning using Large Language Models and interactive web applications.

## 🌟 Project Overview

This project combines cutting-edge AI technology with astronomical research to create:
1. **LLM Training System** - Specialized language models for exoplanet research
2. **Web Application** - Interactive platform for exploring and analyzing exoplanet data

## 📁 Project Structure

```
nasa-mission/
├── llm-training/          # AI Model Training & Inference
│   ├── train/            # Training scripts (fine-tuning, GRPO)
│   ├── inference/        # Model inference and chat interfaces
│   ├── evaluation/       # Model evaluation metrics
│   ├── scripts/          # Data preparation utilities
│   ├── configs/          # Training configurations
│   ├── notebooks/        # Jupyter notebooks for experimentation
│   └── data/            # Dataset storage
│
└── web-app/              # Web Application (Frontend & Backend)
    ├── react-frontend/   # React-based user interface
    ├── llm-backend/      # FastAPI backend server
    └── *.sql            # Database schemas
```

## 🚀 Quick Start

### LLM Training

Train specialized language models for exoplanet research:

```bash
cd llm-training

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Prepare dataset
python3 scripts/prepare_dataset.py --output data/processed/

# Run training
python3 train/cpu_finetune.py --dataset data/processed/combined_dataset.json

# Chat with your model
python3 inference/chat_complete.py --model outputs/cpu_model
```

### Web Application

Launch the interactive web platform:

```bash
cd web-app

# Backend setup
cd llm-backend
pip install -r requirements.txt
python app.py

# Frontend setup (in a new terminal)
cd react-frontend
npm install
npm start
```

## 🔬 Features

### LLM Training System
- **Fast Fine-tuning**: Leverages Unsloth for 2x faster training
- **Reasoning Enhancement**: GRPO for improved scientific reasoning
- **Exoplanet Specialization**: Custom dataset for astronomical data
- **Multiple Model Support**: Compatible with Llama-3, Qwen3, and more
- **Comprehensive Evaluation**: Built-in metrics for accuracy

### Web Application
- **Interactive Visualizations**: Explore exoplanet data dynamically
- **Real-time Analysis**: AI-powered insights and classifications
- **Database Integration**: Supabase backend for data management
- **Modern UI**: React-based responsive interface
- **API Server**: FastAPI backend for model integration

## 📊 Dataset

The training dataset includes:
- Exoplanet discovery papers and abstracts
- NASA Exoplanet Archive data
- Scientific reasoning chains for astronomical phenomena
- Q&A pairs for exoplanet characteristics and detection methods

## 🎯 Use Cases

1. **Research**: Train specialized models for astronomical research
2. **Education**: Interactive learning platform for exoplanet science
3. **Analysis**: Automated classification and analysis of exoplanet data
4. **Discovery**: AI-assisted discovery of new exoplanet candidates

## 🛠️ Technology Stack

### LLM Training
- Python 3.8+
- Unsloth (Fast LLM training)
- PyTorch
- Transformers (Hugging Face)
- GRPO (Group Relative Policy Optimization)

### Web Application
- **Frontend**: React, JavaScript, CSS
- **Backend**: Python, FastAPI
- **Database**: Supabase/PostgreSQL
- **Deployment**: Docker-ready

## 📖 Documentation

- [LLM Training Guide](./llm-training/README.md)
- [Web App Documentation](./web-app/README.md)
- [API Reference](./web-app/llm-backend/README.md)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

## 📄 License

This project is licensed under the MIT License.

## 🌌 About

This project is part of a NASA-inspired mission to advance our understanding of exoplanets through the combination of AI and astronomical research.

---

**Built with ❤️ for space exploration and scientific discovery**
