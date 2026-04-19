import threading
import logging
from fastapi import APIRouter, HTTPException, Depends

from app.api.models import TextRequest, SpamResponse, FakeNewsResponse, AutoDetectResponse, HealthResponse, FeedbackRequest, FeedbackResponse, RetrainResponse
from app.ml.predictor import ModelPredictor
import main
import feedback_db

logger = logging.getLogger(__name__)
router = APIRouter()

RETRAIN_THRESHOLD = 10

def get_predictor() -> ModelPredictor:
    return main.get_predictor()

@router.post("/detect-spam", response_model=SpamResponse)
async def detect_spam(
    request: TextRequest,
    predictor: ModelPredictor = Depends(get_predictor),
):
    try:
        result = predictor.predict_spam(request.text)
        return SpamResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/detect-fake-news", response_model=FakeNewsResponse)
async def detect_fake_news(
    request: TextRequest,
    predictor: ModelPredictor = Depends(get_predictor),
):
    try:
        result = predictor.predict_fake_news(request.text)
        return FakeNewsResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/auto-detect", response_model=AutoDetectResponse)
async def auto_detect(
    request: TextRequest,
    predictor: ModelPredictor = Depends(get_predictor),
):
    try:
        result = predictor.auto_detect(request.text)
        return AutoDetectResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health", response_model=HealthResponse)
async def health(predictor: ModelPredictor = Depends(get_predictor)):
    models_status = predictor.get_models_status()
    return HealthResponse(
        status="healthy",
        models_loaded=models_status,
        all_models_ready=all(models_status.values()),
    )

@router.post("/feedback", response_model=FeedbackResponse)
async def submit_feedback(request: FeedbackRequest, predictor: ModelPredictor = Depends(get_predictor)):
    try:
        stored_label = (
            request.prediction
            if request.satisfied
            else feedback_db.OPPOSITE[request.prediction]
        )

        if request.prediction in ("spam", "ham"):
            feedback_db.store_spam_feedback(request.processed_text, stored_label)
        else:
            feedback_db.store_fake_news_feedback(request.processed_text, stored_label)

        counts = feedback_db.get_counts()

        retrain_triggered = False
        if counts["total"] % RETRAIN_THRESHOLD == 0:
            logger.info(
                "Feedback threshold (%d) reached — triggering background retrain",
                RETRAIN_THRESHOLD,
            )
            thread = threading.Thread(
                target=_retrain_in_background,
                args=(predictor,),
                daemon=True,
            )
            thread.start()
            retrain_triggered = True

        return FeedbackResponse(
            success=True,
            message="Thank you for your feedback! It helps us improve accuracy.",
            stored_label=stored_label,
            feedback_counts=counts,
            retrain_triggered=retrain_triggered,
        )

    except Exception as e:
        logger.error("Error storing feedback: %s", e)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/retrain", response_model=RetrainResponse)
async def trigger_retrain(predictor: ModelPredictor = Depends(get_predictor)):
    try:
        counts = feedback_db.get_counts()
        logger.info("Manual retrain requested — feedback counts: %s", counts)
        _retrain_in_background(predictor)
        return RetrainResponse(
            success=True,
            message="Models retrained successfully using dataset + feedback data.",
            feedback_counts=counts,
        )
    except Exception as e:
        logger.error("Retrain error: %s", e)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/feedback/stats")
async def feedback_stats():
    return feedback_db.get_counts()

def _retrain_in_background(predictor: ModelPredictor) -> None:
    try:
        from train_models import train_all_models
        train_all_models()
        predictor.load_models()
        logger.info("Models retrained and hot-reloaded successfully")
    except Exception as exc:
        logger.error("Background retrain failed: %s", exc)