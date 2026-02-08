#!/usr/bin/env bash
set -e

python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install fastapi[all] pillow numpy uvicorn pytest

# generate mock dataset
python mock_data/generate_synthetic_dataset.py --n 200

# run the demo
uvicorn app.main:app --reload --port 8000
