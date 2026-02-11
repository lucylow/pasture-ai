#!/usr/bin/env python3
"""
Train BiomassRNN on synthetic temporal data.
Run: python scripts/train_temporal_rnn.py
Saves models/temporal_v1.pt for use by pipelines/temporal_inference.py
"""
import sys
from pathlib import Path

# Add project root
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import torch
from app.models.temporal_growth import BiomassRNN
from app.mock.temporal_data import generate_mock_timeseries


def main():
    model = BiomassRNN()
    optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)
    model.train()

    # Generate synthetic training sequences
    sequences = []
    for pid in ["P1", "P2", "P3", "P4"]:
        data = generate_mock_timeseries(pid, 90)
        history = data["history"]
        for i in range(10, len(history) - 1):
            seq = history[i - 10 : i]
            target = history[i + 1]["biomass_t_ha"]
            rows = [[h["biomass_t_ha"], h["rainfall_mm"], h["temperature_c"], h["grazing_pressure"]] for h in seq]
            sequences.append((torch.tensor(rows, dtype=torch.float32), target))

    # Train for a few epochs
    for epoch in range(20):
        total_loss = 0.0
        for x, y in sequences:
            x_batch = x.unsqueeze(0)
            pred = model(x_batch).squeeze()
            loss = (pred - y) ** 2
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()
            total_loss += loss.item()
        if (epoch + 1) % 5 == 0:
            print(f"Epoch {epoch+1} loss: {total_loss / len(sequences):.4f}")

    out_dir = Path(__file__).resolve().parents[1] / "models"
    out_dir.mkdir(exist_ok=True)
    torch.save(model.state_dict(), out_dir / "temporal_v1.pt")
    print(f"Saved {out_dir / 'temporal_v1.pt'}")


if __name__ == "__main__":
    main()
