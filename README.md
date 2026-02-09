# PastureAI: Real-Time Biomass Estimation for Sustainable Grazing

PastureAI is an end-to-end AI-driven platform designed to revolutionize pasture management through high-precision biomass estimation and vegetation health monitoring. By leveraging multispectral drone imagery and advanced machine learning, PastureAI provides farmers with actionable insights to optimize grazing rotations, improve feed planning, and promote regenerative agricultural practices.

## 🚀 Core Features

- **Image2Biomass Pipeline**: A robust data lifecycle from raw drone imagery to precise biomass metrics.
- **Multispectral Analysis**: Automated computation of vegetation indices including **NDVI**, **EVI**, and **GNDVI**.
- **Deterministic Mock Predictor**: A high-performance, interpretable baseline for rapid demo and UI/UX validation.
- **Active Learning Framework**: Human-in-the-loop workflow using uncertainty sampling to optimize labeling efforts.
- **Production-Ready Orchestration**: Integrated Airflow DAGs for automated data ingestion and preprocessing.
- **Edge Deployment**: Utilities for exporting models to **ONNX** for mobile and edge device integration.

## 🛠 Project Architecture

### 1. Data Pipeline (`data_pipeline/`)
- **Ingestion**: Automated EXIF/GPS extraction from drone imagery.
- **Preprocessing**: Radiometric conversion and GeoTIFF standardization.
- **Patch Sampling**: Sliding-window extraction for training data preparation.
- **CLI**: Unified command-line interface for managing the entire pipeline.

### 2. AI & Inference (`app/`)
- **Mock Inference**: Deterministic heuristics for reproducible biomass estimation.
- **Schemas**: Pydantic-validated data models for robust API communication.
- **API**: FastAPI-powered endpoints for single and batch prediction processing.

### 3. Orchestration & Ops
- **Airflow**: Scheduled DAGs for end-to-end data workflows.
- **Docker**: Containerized environment for consistent local and cloud deployment.
- **Testing**: Comprehensive Pytest suite for pipeline and model validation.

## 🚦 Getting Started

### Prerequisites
- Python 3.10+
- Docker & Docker Compose (optional)

### Installation
```bash
# Clone the repository
git clone https://github.com/lucylow/pasture-ai.git
cd pasture-ai

# Set up the environment
bash scripts/create_demo_env.sh
```

### Running the Demo
```bash
# Start the FastAPI server
uvicorn app.main:app --reload --port 8000
```

### Using the CLI
```bash
# Ingest drone images
python -m data_pipeline.cli ingest --src /path/to/images --out data/catalog.csv

# Compute vegetation indices
python -m data_pipeline.cli indices --tif data/scene.tif --out data/indices/
```

## 📊 Active Learning Workflow
PastureAI implements a pool-based uncertainty sampling strategy. The `ActiveLearner` uses a RandomForest ensemble to identify patches with the highest prediction variance, ensuring that human labeling effort is focused on the most informative data points.

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
*Developed for the Code Spring Hackathon 2026.*
