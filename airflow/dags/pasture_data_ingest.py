from airflow import DAG
from airflow.operators.bash import BashOperator
from datetime import datetime, timedelta

default_args = {
    'owner': 'pasture_ai',
    'depends_on_past_backfill': False,
    'start_date': datetime(2026, 1, 1),
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

with DAG(
    'pasture_data_ingest_pipeline',
    default_args=default_args,
    description='End-to-end pasture data ingestion and preprocessing',
    schedule_interval=timedelta(days=1),
    catchup=False,
) as dag:

    t1 = BashOperator(
        task_id='ingest_drone_images',
        bash_command='python3 /home/ubuntu/pasture-ai-debug/data_pipeline/ingest_drone.py --src /data/raw/drone/ --out /data/interim/catalog.csv',
    )

    t2 = BashOperator(
        task_id='compute_vegetation_indices',
        bash_command='python3 /home/ubuntu/pasture-ai-debug/data_pipeline/compute_indices.py --tif /data/processed/latest_scene.tif --out /data/processed/indices/',
    )

    t3 = BashOperator(
        task_id='extract_training_patches',
        bash_command='python3 /home/ubuntu/pasture-ai-debug/data_pipeline/patch_sampler.py --tif /data/processed/indices/ndvi.tif --out /data/processed/patches/ --patch 256 --stride 128',
    )

    t1 >> t2 >> t3
