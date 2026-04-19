from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    API_V1_STR:   str = "/api"
    PROJECT_NAME: str = "Text Classification API"
    VERSION:      str = "2.0.0"
    FRONTEND_URL: str = "http://localhost:3000"

    @property
    def CORS_ORIGINS(self) -> List[str]:
        origins = [
            "http://localhost:3000",
            "http://localhost:3001",
            "http://127.0.0.1:3000",
        ]
        if self.FRONTEND_URL and self.FRONTEND_URL not in origins:
            origins.append(self.FRONTEND_URL)
            origins.append(self.FRONTEND_URL.rstrip("/"))
        return list(set(origins))

    MODELS_DIR:               str = "app/models"
    SPAM_MODEL_PATH:          str = os.path.join("app/models", "spam_detector.pkl")
    SPAM_VECTORIZER_PATH:     str = os.path.join("app/models", "spam_vectorizer.pkl")
    FAKE_NEWS_MODEL_PATH:     str = os.path.join("app/models", "fake_news_detector.pkl")
    FAKE_NEWS_VECTORIZER_PATH: str = os.path.join("app/models", "fake_news_vectorizer.pkl")

    DATASETS_DIR: str = "datasets"

    HOST:   str  = "0.0.0.0"
    PORT:   int  = 8000
    RELOAD: bool = False

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()