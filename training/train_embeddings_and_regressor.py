import argparse
from pathlib import Path
import numpy as np
import pandas as pd
import torch
from joblib import dump
from sklearn.ensemble import RandomForestRegressor

# NOTE: These helpers are expected to be in a file named repo_helpers.py in the same directory or in the python path.
# Since they were mentioned as "already in your repo" but are not present in the provided file list, 
# you should ensure repo_helpers.py exists with compute_embeddings, SupervisedEmbeddingEngine, etc.
try:
    from repo_helpers import compute_embeddings, SupervisedEmbeddingEngine, cross_validate
except ImportError:
    print("Warning: repo_helpers.py not found. Please ensure it contains compute_embeddings, SupervisedEmbeddingEngine, and cross_validate.")

from app.core.ai_model import BiomassModel

TARGET_NAMES = ["Dry_Green_g", "Dry_Dead_g", "Dry_Clover_g", "GDM_g", "Dry_Total_g"]

def train(train_csv, image_root, embedding_model, output_dir):
    df = pd.read_csv(train_csv)
    unique_images = df.drop_duplicates(subset=["image_path"])
    
    # compute embeddings (uses model->patch split->pooling)
    # This assumes compute_embeddings is available via repo_helpers
    emb_df = compute_embeddings(embedding_model, unique_images, patch_size=520)
    merged = unique_images.merge(emb_df, on="image_path")
    X = merged[[c for c in merged.columns if c.startswith("emb")]].values
    
    # build feature-engine and transform
    engine = SupervisedEmbeddingEngine(n_pca=0.98, n_pls=8, n_gmm=5)
    engine.fit(X, merged[TARGET_NAMES])
    X_eng = engine.transform(X)
    
    # per-target regressors
    models = {}
    for i, t in enumerate(TARGET_NAMES):
        regr = RandomForestRegressor(n_estimators=200, random_state=42)
        regr.fit(X_eng, merged[t].values)
        models[t] = regr
        dump(regr, Path(output_dir) / f"{t}_rf.joblib")
    
    dump(engine, Path(output_dir) / "feature_engine.joblib")
    print("Saved trained models and feature engine to", output_dir)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--train-csv", required=True)
    parser.add_argument("--image-root", required=True)
    parser.add_argument("--embedding-model", default="facebook/dinov2-vit-base-patch14")
    parser.add_argument("--out", default="artifacts")
    args = parser.parse_args()
    Path(args.out).mkdir(parents=True, exist_ok=True)
    train(args.train_csv, args.image_root, args.embedding_model, args.out)
