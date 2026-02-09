import pytest
from app.mock_inference.mock_predictor import predict_from_pil
from PIL import Image
import numpy as np

def test_predict_dark_image():
    # Dark soil-like image
    img = Image.new('RGB', (200, 200), (50, 50, 50))
    out = predict_from_pil(img)
    assert 'predictions' in out
    # Should be at the floor value
    assert out['predictions']['Dry_Total_g'] >= 0.05
    assert out['metrics']['pasture_health'] == 'poor'

def test_predict_bright_green():
    # Bright green image
    # Note: Our new predictor uses HSV, so we should make sure it's actually green in HSV
    # Green is around Hue 60 (120 degrees)
    img = Image.new('HSV', (200, 200), (60, 200, 200)).convert('RGB')
    out = predict_from_pil(img)
    assert out['predictions']['Dry_Green_g'] > 0.05
    assert out['metrics']['coverage_pct'] > 50
