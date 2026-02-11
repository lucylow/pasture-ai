"""
Evaluation metrics for Image2Biomass: RMSE, MAE, calibration (coverage).
"""
import numpy as np


def rmse(y_true, y_pred):
    return np.sqrt(np.mean((y_true - y_pred) ** 2))


def mae(y_true, y_pred):
    return np.mean(np.abs(y_true - y_pred))


def calibration_coverage(y_true, y_lower, y_upper):
    """
    Fraction of samples where y_true falls within [y_lower, y_upper].
    Target ~0.9 for 90% intervals.
    """
    inside = (y_true >= y_lower) & (y_true <= y_upper)
    return float(np.mean(inside))
