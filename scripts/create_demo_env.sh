#!/usr/bin/env bash
set -e

# Use system python to install dependencies for the demo
# In this environment, we'll just use the pre-installed packages or install them via pip
echo "Installing dependencies..."
pip3 install fastapi uvicorn pydantic pydantic-settings pillow numpy pandas opencv-python-headless pytest httpx

# generate mock dataset
echo "Generating mock dataset..."
python3 mock_data/generate_synthetic_dataset.py --n 200

echo "Environment ready. Run 'uvicorn app.main:app --port 8000' to start the API."
