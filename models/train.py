"""
Image2Biomass training loop: patch-based U-Net regression.
"""
import torch
from torch.utils.data import DataLoader
from pathlib import Path

from model import UNetRegressor
from dataset import PatchDataset, make_synthetic_samples
from metrics import rmse
import torch.optim as optim


def train_loop(
    train_ds, val_ds, out_dir="runs", epochs=30, device="cuda"
):
    model = UNetRegressor(in_ch=4).to(device)
    opt = optim.Adam(model.parameters(), lr=1e-3)
    loss_fn = torch.nn.L1Loss()
    best_val = 1e9
    Path(out_dir).mkdir(parents=True, exist_ok=True)

    train_loader = DataLoader(
        train_ds, batch_size=8, shuffle=True, num_workers=0
    )
    val_loader = DataLoader(val_ds, batch_size=4, shuffle=False, num_workers=0)

    for epoch in range(epochs):
        model.train()
        train_loss = 0.0
        for imgs, labs in train_loader:
            imgs = imgs.to(device)
            labs = labs.to(device)
            preds = model(imgs)
            loss = loss_fn(preds, labs)
            opt.zero_grad()
            loss.backward()
            opt.step()
            train_loss += loss.item()

        model.eval()
        val_loss = 0.0
        with torch.no_grad():
            for imgs, labs in val_loader:
                imgs = imgs.to(device)
                labs = labs.to(device)
                preds = model(imgs)
                val_loss += loss_fn(preds, labs).item()
        val_loss /= len(val_loader)
        train_loss /= len(train_loader)
        print(f"Epoch {epoch} train {train_loss:.4f} val {val_loss:.4f}")

        if val_loss < best_val:
            best_val = val_loss
            torch.save(model.state_dict(), f"{out_dir}/best_model.pth")

    return model


if __name__ == "__main__":
    # Synthetic dataset for local demo
    samples = make_synthetic_samples(n=24, data_dir="runs/synthetic")
    n_val = max(1, len(samples) // 4)
    train_samples = samples[n_val:]
    val_samples = samples[:n_val]
    train_ds = PatchDataset(train_samples)
    val_ds = PatchDataset(val_samples)

    device = "cuda" if torch.cuda.is_available() else "cpu"
    train_loop(train_ds, val_ds, out_dir="runs", epochs=5, device=device)
