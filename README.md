# 🚀 NASA Mission -- Exoplanet Discovery & Analysis Platform

A comprehensive platform for exoplanet discovery, classification, and
scientific reasoning using Large Language Models (LLMs) and interactive
web applications.

------------------------------------------------------------------------

## 🌟 Project Overview

This project merges **cutting-edge AI** with **astronomical research**
to build an intelligent system that discovers, analyzes, and explains
exoplanets through natural language reasoning and interactive
visualization.

### Core Components

-   **LLM Training System** --- Specialized large language models for
    exoplanet discovery and reasoning\
-   **Web Application** --- Interactive scientific platform for
    exploring and analyzing exoplanet data

------------------------------------------------------------------------

## 📁 Project Structure

    nasa-mission/
    ├── llm-training/          # AI Model Training & Inference
    │   ├── train/            # Training scripts (fine-tuning, GRPO)
    │   ├── inference/        # Model inference and chat interfaces
    │   ├── evaluation/       # Model evaluation metrics
    │   ├── scripts/          # Data preparation utilities
    │   ├── configs/          # Training configurations
    │   ├── notebooks/        # Jupyter notebooks for experimentation
    │   └── data/             # Dataset storage
    │
    └── web-app/              # Web Application (Frontend & Backend)
        ├── react-frontend/   # React-based user interface
        ├── llm-backend/      # FastAPI backend server
        └── *.sql             # Database schemas

------------------------------------------------------------------------

## 🧠 New Features

Our solution integrates **multiple AI assistants**, each analyzing
astronomical data from individual **virtual space telescopes**.\
Rather than exchanging raw data, these AI systems share **nuanced
insights** --- complete with analytical reasoning and visual
explanations --- fostering collaboration among scientists, students, and
enthusiasts.

### Key Highlights

-   **Human-in-the-loop learning** --- Users verify AI findings, refine
    detections, and improve training feedback loops\
-   **Interactive React frontend** --- Includes scientific calculators,
    rich data visualizations, and **3D solar system simulations**\
-   **FastAPI backend** --- Handles AI chat, exoplanet analysis, and key
    calculations (transit depth, equilibrium temperature, habitability
    metrics)\
-   **Scalable Deployment** --- Runs on **Render** with a containerized
    blueprint\
-   **Custom Exoplanet LLM** --- Tuned for research and education with
    transparent reasoning and explainability

### 3D Simulation Module

A **fully interactive 3D simulation** lets users explore **imaginary
solar systems** populated with stars and exoplanets.\
- Users can select celestial bodies, view classifications, and study
scientific properties in real time.\
- The module simplifies complex astrophysics through visualization,
encouraging curiosity and hands-on discovery.

------------------------------------------------------------------------

## 🔭 Exoplanet Classification Parameters

  -----------------------------------------------------------------------
  **Parameter**                       **Description**
  ----------------------------------- -----------------------------------
  **Location**                        Orbits a star outside our Solar
                                      System

  **Size (Radius, Mass)**             Within planetary range; smaller
                                      than brown dwarfs

  **Orbital Period**                  Time taken to complete one orbit

  **Transit Depth**                   Fraction of stellar light blocked
                                      during transit

  **Equilibrium Temperature**         Based on star's luminosity and
                                      distance

  **Habitability Score**              Temperature, atmosphere, and
                                      habitable zone metrics

  **Spectral/Composition Data**       Must differ from stars/brown dwarfs
                                      (spectra, emission lines)

  **Detection Method**                Confirmed via transit, radial
                                      velocity, imaging, or microlensing
  -----------------------------------------------------------------------

A celestial body qualifies as an **exoplanet** if: - It orbits a star
other than the Sun,\
- Its mass is below the fusion threshold (not a brown dwarf), and\
- Observational data aligns with planetary characteristics.

------------------------------------------------------------------------

## 📊 Datasets

1.  **NASA Exoplanet Archive (Caltech/IPAC)**
    -   Confirmed exoplanets, light curves, metrics, and validation
        reports\
    -   🔗 <https://exoplanetarchive.ipac.caltech.edu>
2.  **TESS Mission Data (MAST Archive)**
    -   Full frame images, pixel files, time series for transit
        searches\
    -   🔗 <https://archive.stsci.edu/missions-and-data/tess>
3.  **Kepler Mission Data (MAST / AWS)**
    -   Light curves and planetary candidate catalogs for 180k+ stars\
    -   🔗 <https://archive.stsci.edu/missions-and-data/kepler>
4.  **Kaggle Datasets**
    -   Curated NASA datasets for ML and exploratory analysis\
    -   🔗 [NASA Exoplanet
        Data](https://www.kaggle.com/datasets/harvitronix/nasa-exoplanet-data)\
    -   🔗 [Kepler & TESS
        Data](https://www.kaggle.com/datasets/shubhendra7/kepler-tess-exoplanet-data)

------------------------------------------------------------------------

## 🧩 LLM Training System

-   **Fast Fine-Tuning** --- Uses **Unsloth** for 2× faster model
    adaptation\
-   **Enhanced Reasoning** --- **GRPO (Group Relative Policy
    Optimization)** improves analytical precision\
-   **Astronomy-Specific Dataset** --- Trained on curated scientific
    corpora\
-   **Multi-Model Compatibility** --- Works with **Llama-3, Qwen3**, and
    other transformer models\
-   **Evaluation Tools** --- Built-in metrics for reasoning and factual
    accuracy

------------------------------------------------------------------------

## 🌐 Web Application

### Features

-   **Dynamic Visualizations** --- Graphs, orbit maps, and discovery
    charts\
-   **AI Chat Assistant** --- Natural-language interaction with
    exoplanet data\
-   **Real-Time Analysis** --- Generate planetary classifications on
    demand\
-   **Supabase Integration** --- PostgreSQL-powered backend\
-   **Responsive React UI** --- Built with modern design and
    interactivity

------------------------------------------------------------------------

## ⚙️ Technology Stack

  **Component**             **Tech Used**
  ------------------------- ----------------------------------------
  **Language Models**       Python, PyTorch, Transformers, Unsloth
  **Training Techniques**   GRPO, fine-tuning, reasoning chains
  **Frontend**              React, JavaScript, CSS
  **Backend**               FastAPI, Python
  **Database**              Supabase/PostgreSQL
  **Deployment**            Docker, Render

------------------------------------------------------------------------

## 🎓 Use Cases

-   **Research** --- Specialized LLMs for astrophysics and planetary
    studies\
-   **Education** --- Interactive visual learning for students\
-   **Analysis** --- Automated exoplanet classification\
-   **Discovery** --- AI-assisted exploration of new exoplanet
    candidates

------------------------------------------------------------------------

## 📖 Documentation

-   **LLM Training Guide**\
-   **Web App Setup & API Reference**\
-   **Data Preparation & Evaluation Tutorials**

------------------------------------------------------------------------

## 🤝 Contributing

Contributions are welcome!\
Submit pull requests, bug fixes, or feature suggestions to improve both
AI and visualization components.

------------------------------------------------------------------------

## 📄 License

Licensed under the **MIT License** --- open for research and educational
development.

------------------------------------------------------------------------

## 🌌 About

A NASA-inspired mission to **advance our understanding of exoplanets**
through AI-driven discovery, simulation, and reasoning.\
Built with ❤️ for **space exploration** and **scientific discovery**.

