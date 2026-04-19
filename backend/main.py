from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.api.routes import router
from app.core.config import settings
from app.ml.predictor import ModelPredictor
import feedback_db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

predictor: ModelPredictor = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global predictor
    logger.info("Starting FastAPI application...")

    try:
        feedback_db.init_db()
    except Exception as e:
        logger.error("Could not init feedback DB: %s", e)

    try:
        predictor = ModelPredictor()
        predictor.load_models()
        logger.info("Models loaded successfully")
    except Exception as e:
        logger.error("Error loading models: %s", e)

    yield

    logger.info("Shutting down application...")

app = FastAPI(
    title="Text Classification API",
    description="AI-powered spam and fake news detection with continuous learning via user feedback",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

@app.get("/")
async def root():
    return {
        "message": "Text Classification API",
        "version": "2.0.0",
        "docs": "/docs",
        "health": "/api/health",
        "feedback_stats": "/api/feedback/stats",
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "models_loaded": predictor is not None and predictor.models_loaded(),
    }

def get_predictor() -> ModelPredictor:
    if predictor is None:
        raise HTTPException(status_code=503, detail="Models not loaded")
    return predictor

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
    )