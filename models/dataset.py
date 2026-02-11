"""
Patch-based dataset for Image2Biomass training.
Expects samples: list of {image_path, label_path}.
"""
import torch
from torch.utils.data import Dataset
import numpy as np
from pathlib import Path


class PatchDataset(Dataset):
    def __init__(self, samples: list, transforms=None):
        """
        samples: list of dict with keys image_path, label_path
        transforms: optional callable(img, label) -> (img, label)
        """
        self.samples = samples
        self.transforms = transforms

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        s = self.samples[idx]
        imp = Path(s["image_path"])
        labp = Path(s["label_path"])

        if imp.suffix == ".npy":
            img = np.load(imp).astype("float32")
            label = np.load(labp).astype("float32")
        else:
            import rasterio
            with rasterio.open(s["image_path"]) as src:
                img = src.read()  # C x H x W
            with rasterio.open(s["label_path"]) as lab:
                label = lab.read(1)  # H x W
            img = img.astype("float32")
            label = label.astype("float32")

        img = img / 10000.0
        if self.transforms:
            img, label = self.transforms(img, label)
        return torch.tensor(img, dtype=torch.float32), torch.tensor(
            label, dtype=torch.float32
        )


def make_synthetic_samples(n=16, data_dir="runs/synthetic"):
    """Create minimal synthetic dataset for testing training loop."""
    Path(data_dir).mkdir(parents=True, exist_ok=True)
    samples = []
    for i in range(n):
        img_path = Path(data_dir) / f"img_{i}.npy"
        lab_path = Path(data_dir) / f"lab_{i}.npy"
        img = np.random.rand(4, 256, 256).astype("float32") * 10000
        lab = np.random.rand(256, 256).astype("float32") * 5.0
        np.save(img_path, img)
        np.save(lab_path, lab)
        samples.append({"image_path": str(img_path), "label_path": str(lab_path)})
    return samples
