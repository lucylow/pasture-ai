"""
Tile pyramid generator: orthomosaic → XYZ/MBTiles for web map display.
Produces TileJSON for Mapbox/MapLibre consumption.
"""
import json
from pathlib import Path
import logging

logger = logging.getLogger(__name__)


def generate_xyz_tiles(
    ortho_path: str,
    output_dir: str,
    min_zoom: int = 10,
    max_zoom: int = 16,
    tile_size: int = 256,
) -> str:
    """
    Generate XYZ tile pyramid from GeoTIFF.
    Uses rasterio + rio-tiler or gdal2tiles.py in production.
    """
    try:
        import rasterio
        from rasterio.warp import calculate_default_transform, reproject, Resampling

        out_path = Path(output_dir)
        out_path.mkdir(parents=True, exist_ok=True)

        with rasterio.open(ortho_path) as src:
            # Simplified: write one zoom level as placeholder
            z = 14
            (out_path / str(z) / "0" / "0").mkdir(parents=True, exist_ok=True)
            # In production: use gdal2tiles or rio-tiler
            # For demo: create TileJSON only
            pass

        tilejson_path = out_path / "tilejson.json"
        base_url = f"/api/v1/tiles/{{pasture_id}}/{{z}}/{{x}}/{{y}}.png"
        tilejson = {
            "tilejson": "2.2.0",
            "name": "pasture-biomass",
            "tiles": [base_url],
            "minzoom": min_zoom,
            "maxzoom": max_zoom,
            "format": "png",
        }
        with open(tilejson_path, "w") as f:
            json.dump(tilejson, f, indent=2)
        logger.info(f"TileJSON: {tilejson_path}")
        return str(tilejson_path)
    except ImportError:
        logger.warning("rasterio not installed")
        return ""


def write_tilejson(
    output_path: str,
    base_url_template: str,
    minzoom: int = 10,
    maxzoom: int = 16,
) -> None:
    """Write TileJSON manifest for frontend."""
    data = {
        "tilejson": "2.2.0",
        "name": "pasture-biomass",
        "tiles": [base_url_template],
        "minzoom": minzoom,
        "maxzoom": maxzoom,
    }
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w") as f:
        json.dump(data, f, indent=2)


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--ortho", required=True, help="Input orthomosaic GeoTIFF")
    parser.add_argument("--out", required=True, help="Output tiles directory")
    args = parser.parse_args()
    generate_xyz_tiles(args.ortho, args.out)
