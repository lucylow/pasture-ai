from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MODEL_PATH: str = "artifacts/biomass_model.pth"
    EMBEDDING_MODEL: str = "facebook/dinov2-vit-base-patch14"
    EMBED_DIM: int = 768  # DINOv2 ViT-B/14 has 768 dim
    TMP_DIR: str = "tmp"

    class Config:
        env_prefix = "PASTUREAI_"

settings = Settings()
