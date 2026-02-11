"""
Export trained UNetRegressor to TorchScript for inference server.
"""
import torch
from pathlib import Path
from model import UNetRegressor


def export(model_path="runs/best_model.pth", out_path="runs/biomass_model_ts.pt"):
    device = "cpu"
    m = UNetRegressor(in_ch=4)
    pth = Path(model_path)
    if not pth.exists():
        print(f"Model not found at {model_path}. Skipping export.")
        return
    m.load_state_dict(torch.load(pth, map_location=device))
    m.eval()

    example = torch.randn(1, 4, 256, 256)
    traced = torch.jit.trace(m, example)
    Path(out_path).parent.mkdir(parents=True, exist_ok=True)
    traced.save(out_path)
    print(f"Saved TorchScript model: {out_path}")


if __name__ == "__main__":
    export()
