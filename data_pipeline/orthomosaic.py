"""
Orthomosaic generation: stitch drone images into georeferenced raster.
Integrates with ODM/Metashape or cloud providers (Pix4D, DroneDeploy).
"""
import subprocess
from pathlib import Path
import logging

logger = logging.getLogger(__name__)


def run_odm_ortho(
    project_dir: str,
    output_path: str,
    odm_bin: str = "odm",
) -> str:
    """
    Run OpenDroneMap orthomosaic pipeline.
    Requires ODM installed: https://www.opendronemap.org/
    """
    cmd = [
        odm_bin,
        "project",
        project_dir,
        "--output",
        output_path,
    ]
    subprocess.run(cmd, check=True)
    return output_path


def run_placeholder_ortho(
    input_images_dir: str,
    output_tif: str,
) -> str:
    """
    Placeholder for dev/demo: create empty GeoTIFF.
    Replace with real ODM/Pix4D/Metashape in production.
    """
    try:
        import numpy as np
        import rasterio
        from rasterio.crs import CRS
        from rasterio.transform import from_bounds

        # Dummy bounds (example pasture)
        bounds = (150.87, -34.42, 150.89, -34.40)
        transform = from_bounds(*bounds, 1024, 1024)
        arr = np.zeros((4, 1024, 1024), dtype=np.float32)
        arr[1] = 0.2  # Green
        arr[2] = 0.15
        arr[3] = 0.25  # NIR

        with rasterio.open(
            output_tif,
            "w",
            driver="GTiff",
            height=1024,
            width=1024,
            count=4,
            dtype=arr.dtype,
            crs=CRS.from_epsg(4326),
            transform=transform,
        ) as dst:
            dst.write(arr)
        logger.info(f"Created placeholder ortho: {output_tif}")
        return output_tif
    except ImportError:
        logger.warning("rasterio not installed; orthomosaic skipped")
        return ""


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, help="Input images directory")
    parser.add_argument("--output", required=True, help="Output GeoTIFF path")
    args = parser.parse_args()
    run_placeholder_ortho(args.input, args.output)
