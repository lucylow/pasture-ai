# app/models/temporal_growth_uncertainty.py
"""
BiomassRNNUncertainty: Outputs mean and log-variance for biomass prediction.
Enables probabilistic forecasting and risk-aware decisions.
"""
import torch
import torch.nn as nn


class BiomassRNNUncertainty(nn.Module):
    """
    Outputs mean and log-variance for biomass prediction.
    """

    def __init__(self, input_dim: int = 4, hidden_dim: int = 64):
        super().__init__()
        self.lstm = nn.LSTM(input_dim, hidden_dim, batch_first=True)
        self.mean_head = nn.Linear(hidden_dim, 1)
        self.logvar_head = nn.Linear(hidden_dim, 1)

    def forward(self, x: torch.Tensor) -> tuple[torch.Tensor, torch.Tensor]:
        out, _ = self.lstm(x)
        h = out[:, -1, :]
        mean = self.mean_head(h)
        logvar = self.logvar_head(h)
        return mean, logvar


def gaussian_nll(mean: torch.Tensor, logvar: torch.Tensor, target: torch.Tensor) -> torch.Tensor:
    """
    Negative log-likelihood for Gaussian output.
    Gives calibrated uncertainty; standard in forecasting literature.
    """
    var = torch.exp(logvar)
    return torch.mean((target - mean) ** 2 / var + logvar)
