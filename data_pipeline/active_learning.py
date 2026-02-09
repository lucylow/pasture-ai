import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import logging

logger = logging.getLogger(__name__)

class ActiveLearner:
    def __init__(self, n_estimators=10):
        self.model = RandomForestRegressor(n_estimators=n_estimators)
        
    def train(self, X, y):
        self.model.fit(X, y)
        
    def select_uncertain_samples(self, X_pool, n_samples=10):
        """Select samples with highest prediction variance across the ensemble."""
        if not hasattr(self.model, "estimators_"):
            logger.warning("Model not trained yet. Selecting random samples.")
            return np.random.choice(len(X_pool), min(n_samples, len(X_pool)), replace=False)
            
        # Get predictions from each tree in the forest
        per_tree_preds = np.array([tree.predict(X_pool) for tree in self.model.estimators_])
        
        # Calculate variance across trees (Uncertainty)
        uncertainty = np.var(per_tree_preds, axis=0)
        
        # Normalize uncertainty for better interpretability
        if np.max(uncertainty) > 0:
            uncertainty = uncertainty / np.max(uncertainty)
        
        # Get indices of top N most uncertain samples
        uncertain_indices = np.argsort(uncertainty)[-n_samples:][::-1]
        return uncertain_indices, uncertainty[uncertain_indices]

def ingest_label_studio_export(json_path: str):
    """Helper to ingest labels exported from Label Studio."""
    import json
    with open(json_path, 'r') as f:
        data = json.load(f)
    
    # Process Label Studio JSON format into a flat CSV-ready list
    processed_labels = []
    for entry in data:
        # Simplified extraction logic
        img_path = entry.get('data', {}).get('image')
        annotations = entry.get('annotations', [])
        if annotations:
            # Assuming the first annotation is the biomass value
            biomass = annotations[0].get('result', [{}])[0].get('value', {}).get('text', [None])[0]
            processed_labels.append({'image_path': img_path, 'biomass': biomass})
            
    return pd.DataFrame(processed_labels)

if __name__ == "__main__":
    # Example usage
    logger.info("Active learning module initialized.")
