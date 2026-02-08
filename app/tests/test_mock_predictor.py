import tempfile
from app.mock_inference.mock_predictor import predict_from_pil
from PIL import Image


def test_predict_dark_image():
    img = Image.new('RGB', (200, 200), (40, 45, 35))
    out = predict_from_pil(img)
    assert 'predictions' in out
    assert out['predictions']['Dry_Total_g'] >= 0


def test_predict_bright_green():
    img = Image.new('RGB', (200, 200), (30, 200, 40))
    out = predict_from_pil(img)
    assert out['predictions']['Dry_Green_g'] > out['predictions']['Dry_Dead_g']
