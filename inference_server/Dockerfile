FROM python:3.10-slim
WORKDIR /app
COPY inference_server/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY inference_server/app ./app
# Add runs dir for model; build with: docker build -f inference_server/Dockerfile .
# To include trained model: ensure runs/biomass_model_ts.pt exists before build
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
