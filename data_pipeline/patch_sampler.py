import numpy as np
import rasterio
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

def extract_patches(tif_path: str, out_dir: str, patch_size: int = 256, stride: int = 128):
    """Extract sliding-window patches from a GeoTIFF."""
    out_path = Path(out_dir)
    out_path.mkdir(parents=True, exist_ok=True)
    
    with rasterio.open(tif_path) as src:
        data = src.read()
        c, h, w = data.shape
        
        count = 0
        for y in range(0, h - patch_size + 1, stride):
            for x in range(0, w - patch_size + 1, stride):
                patch = data[:, y:y+patch_size, x:x+patch_size]
                
                # Filter out empty patches (e.g., all zeros or NaNs)
                if np.all(patch == 0) or np.all(np.isnan(patch)):
                    continue
                
                patch_name = f"patch_{y}_{x}.npz"
                np.savez_compressed(out_path / patch_name, patch=patch)
                count += 1
                
        logger.info(f"Extracted {count} patches from {tif_path}")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--tif", required=True, help="Input GeoTIFF")
    parser.add_argument("--out", required=True, help="Output directory for patches")
    parser.add_argument("--patch", type=int, default=256, help="Patch size")
    parser.add_argument("--stride", type=int, default=128, help="Stride size")
    args = parser.parse_args()
    extract_patches(args.tif, args.out, args.patch, args.stride)
