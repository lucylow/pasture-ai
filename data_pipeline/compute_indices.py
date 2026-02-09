import numpy as np
import rasterio
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

def calculate_ndvi(red, nir):
    """Compute Normalized Difference Vegetation Index."""
    denom = nir + red + 1e-8
    return (nir - red) / denom

def calculate_evi(blue, red, nir):
    """Compute Enhanced Vegetation Index."""
    # EVI = G * ((NIR - R) / (NIR + C1 * R - C2 * B + L))
    G = 2.5
    C1 = 6.0
    C2 = 7.5
    L = 1.0
    denom = nir + C1 * red - C2 * blue + L + 1e-8
    return G * ((nir - red) / denom)

def calculate_gndvi(green, nir):
    """Compute Green Normalized Difference Vegetation Index."""
    denom = nir + green + 1e-8
    return (nir - green) / denom

def process_geotiff(tif_path: str, out_dir: str):
    """Compute indices from a multispectral GeoTIFF."""
    if not Path(tif_path).exists():
        logger.error(f"Input file {tif_path} does not exist.")
        return

    try:
        with rasterio.open(tif_path) as src:
            # Assuming standard band order: 1:Blue, 2:Green, 3:Red, 4:NIR
            blue = src.read(1).astype(float)
            green = src.read(2).astype(float)
            red = src.read(3).astype(float)
            nir = src.read(4).astype(float)
            
            profile = src.profile
            profile.update(dtype=rasterio.float32, count=1)
            
            out_path = Path(out_dir)
            out_path.mkdir(parents=True, exist_ok=True)
            
            # NDVI
            ndvi = calculate_ndvi(red, nir)
            with rasterio.open(out_path / "ndvi.tif", 'w', **profile) as dst:
                dst.write(ndvi.astype(rasterio.float32), 1)
                
            # GNDVI
            gndvi = calculate_gndvi(green, nir)
            with rasterio.open(out_path / "gndvi.tif", 'w', **profile) as dst:
                dst.write(gndvi.astype(rasterio.float32), 1)
                
            logger.info(f"Computed indices for {tif_path}")
    except Exception as e:
        logger.error(f"Failed to process {tif_path}: {e}")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--tif", required=True, help="Input multispectral GeoTIFF")
    parser.add_argument("--out", required=True, help="Output directory for index TIFs")
    args = parser.parse_args()
    process_geotiff(args.tif, args.out)
