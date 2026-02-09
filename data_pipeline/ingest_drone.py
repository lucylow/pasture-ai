import os
import exifread
import pandas as pd
from pathlib import Path
import logging
from typing import List, Dict

logger = logging.getLogger(__name__)

def _dms_to_dd(dms, ref):
    """Convert Degrees Minutes Seconds to Decimal Degrees."""
    d = float(dms[0].num) / float(dms[0].den)
    m = float(dms[1].num) / float(dms[1].den)
    s = float(dms[2].num) / float(dms[2].den)
    dd = d + (m / 60.0) + (s / 3600.0)
    if ref in ['S', 'W']:
        dd = -dd
    return dd

def extract_metadata(img_path: Path) -> Dict:
    """Extract EXIF and GPS metadata from a drone image."""
    try:
        with open(img_path, 'rb') as f:
            tags = exifread.process_file(f, details=False)
            
        metadata = {
            "image_path": str(img_path),
            "timestamp": str(tags.get('EXIF DateTimeOriginal', 'unknown')),
            "camera_model": str(tags.get('Image Model', 'unknown')),
            "lat": None,
            "lon": None
        }
        
        if 'GPS GPSLatitude' in tags and 'GPS GPSLatitudeRef' in tags:
            metadata['lat'] = _dms_to_dd(tags['GPS GPSLatitude'].values, tags['GPS GPSLatitudeRef'].values)
        if 'GPS GPSLongitude' in tags and 'GPS GPSLongitudeRef' in tags:
            metadata['lon'] = _dms_to_dd(tags['GPS GPSLongitude'].values, tags['GPS GPSLongitudeRef'].values)
            
        return metadata
    except Exception as e:
        logger.error(f"Error extracting metadata from {img_path}: {e}")
        return {"image_path": str(img_path), "error": str(e)}

def ingest_directory(src_dir: str, output_catalog: str):
    """Scan directory for drone images and create a metadata catalog."""
    src_path = Path(src_dir)
    images = list(src_path.rglob('*.jpg')) + list(src_path.rglob('*.JPG'))
    
    catalog = []
    for img in images:
        meta = extract_metadata(img)
        catalog.append(meta)
        
    df = pd.DataFrame(catalog)
    df.to_csv(output_catalog, index=False)
    logger.info(f"Ingested {len(catalog)} images into {output_catalog}")
    return df

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--src", required=True, help="Source directory of drone images")
    parser.add_argument("--out", default="data/catalog.csv", help="Output catalog CSV path")
    args = parser.parse_args()
    
    os.makedirs(os.path.dirname(args.out), exist_ok=True)
    ingest_directory(args.src, args.out)
