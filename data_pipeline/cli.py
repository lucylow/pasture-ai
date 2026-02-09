import argparse
import sys
import logging
from pathlib import Path
from .ingest_drone import ingest_directory
from .compute_indices import process_geotiff
from .patch_sampler import extract_patches

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("pasture-ai-cli")

def main():
    parser = argparse.ArgumentParser(description="PastureAI Data Pipeline CLI")
    subparsers = parser.add_subparsers(dest="command", help="Pipeline commands")

    # Ingest command
    ingest_parser = subparsers.add_parser("ingest", help="Ingest drone images")
    ingest_parser.add_argument("--src", required=True, help="Source directory")
    ingest_parser.add_argument("--out", default="data/catalog.csv", help="Output catalog path")

    # Indices command
    indices_parser = subparsers.add_parser("indices", help="Compute vegetation indices")
    indices_parser.add_argument("--tif", required=True, help="Input GeoTIFF")
    indices_parser.add_argument("--out", required=True, help="Output directory")

    # Patch command
    patch_parser = subparsers.add_parser("patch", help="Extract patches")
    patch_parser.add_argument("--tif", required=True, help="Input GeoTIFF")
    patch_parser.add_argument("--out", required=True, help="Output directory")
    patch_parser.add_argument("--size", type=int, default=256, help="Patch size")
    patch_parser.add_argument("--stride", type=int, default=128, help="Stride")

    args = parser.parse_args()

    if args.command == "ingest":
        ingest_directory(args.src, args.out)
    elif args.command == "indices":
        process_geotiff(args.tif, args.out)
    elif args.command == "patch":
        extract_patches(args.tif, args.out, args.size, args.stride)
    else:
        parser.print_help()
        sys.exit(1)

if __name__ == "__main__":
    main()
