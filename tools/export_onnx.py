import torch
from app.core.ai_model import BiomassModel
from pathlib import Path
from app.config import settings

def export_onnx(checkpoint_path, out_path="model.onnx"):
    model = BiomassModel(input_dim=settings.EMBED_DIM, hidden_dim=256)
    if Path(checkpoint_path).exists():
        state = torch.load(checkpoint_path, map_location="cpu")
        model.load_state_dict(state)
    else:
        print(f"Warning: Checkpoint {checkpoint_path} not found. Exporting random initialized model.")
    
    model.eval()
    dummy = torch.randn(1, settings.EMBED_DIM)
    torch.onnx.export(
        model, 
        dummy, 
        out_path, 
        input_names=["features"], 
        output_names=["biomass","health_logits","coverage"], 
        opset_version=15
    )
    print("Exported ONNX to", out_path)

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--ckpt", default=settings.MODEL_PATH)
    parser.add_argument("--out", default="biomass.onnx")
    args = parser.parse_args()
    export_onnx(args.ckpt, args.out)
