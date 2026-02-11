# app/models/temporal_growth.py
"""
BiomassRNN: Predicts next-day biomass from past sequence.
Features per timestep: [biomass, rainfall, temperature, grazing_pressure]
"""
import torch
import torch.nn as nn


class BiomassRNN(nn.Module):
    """
    Predicts next-day biomass from past sequence.
    """

    def __init__(self, input_dim: int = 4, hidden_dim: int = 64):
        super().__init__()
        self.lstm = nn.LSTM(input_dim, hidden_dim, batch_first=True)
        self.fc = nn.Linear(hidden_dim, 1)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # x: [B, T, F]
        out, _ = self.lstm(x)
        last = out[:, -1, :]
        return self.fc(last)
