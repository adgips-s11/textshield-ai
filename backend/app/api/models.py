from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Literal

class TextRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Text content to analyze")
    class Config:
        json_schema_extra = {"example": {"text": "WIN FREE MONEY NOW!!!"}}

class ProbabilityDict(BaseModel):
    ham:  Optional[float] = None
    spam: Optional[float] = None
    fake: Optional[float] = None
    real: Optional[float] = None

class SpamResponse(BaseModel):
    success: bool = True
    prediction: Literal["spam", "ham"]
    confidence: float = Field(..., ge=0, le=100)
    processed_text: str
    probabilities: Dict[str, float]

    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "prediction": "spam",
                "confidence": 96.5,
                "processed_text": "win free money now",
                "probabilities": {"ham": 3.5, "spam": 96.5},
            }
        }

class FakeNewsResponse(BaseModel):
    success: bool = True
    prediction: Literal["fake", "real"]
    confidence: float = Field(..., ge=0, le=100)
    processed_text: str
    probabilities: Dict[str, float]

    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "prediction": "fake",
                "confidence": 94.2,
                "processed_text": "shocking discovery scientists baffled",
                "probabilities": {"fake": 94.2, "real": 5.8},
            }
        }

class ContentAnalysis(BaseModel):
    word_count: int
    news_keywords: List[str]
    sms_keywords: List[str]
    has_excessive_punctuation: bool
    classified_as: Literal["sms", "news"]

class AutoDetectResponse(BaseModel):
    success: bool = True
    content_type: Literal["sms", "news"]
    content_analysis: ContentAnalysis
    prediction: Literal["spam", "ham", "fake", "real"]
    confidence: float = Field(..., ge=0, le=100)
    detector_used: Literal["spam_detector", "fake_news_detector"]
    processed_text: str
    probabilities: Dict[str, float]

    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "content_type": "news",
                "content_analysis": {
                    "word_count": 15,
                    "news_keywords": ["breaking", "scientists"],
                    "sms_keywords": [],
                    "has_excessive_punctuation": False,
                    "classified_as": "news",
                },
                "prediction": "fake",
                "confidence": 92.5,
                "detector_used": "fake_news_detector",
                "processed_text": "shocking discovery scientists baffled",
                "probabilities": {"fake": 92.5, "real": 7.5},
            }
        }

class HealthResponse(BaseModel):
    status: Literal["healthy", "unhealthy"]
    models_loaded: Dict[str, bool]
    all_models_ready: bool

    class Config:
        json_schema_extra = {
            "example": {
                "status": "healthy",
                "models_loaded": {
                    "spam_detector": True,
                    "spam_vectorizer": True,
                    "fake_news_detector": True,
                    "fake_news_vectorizer": True,
                },
                "all_models_ready": True,
            }
        }

class FeedbackRequest(BaseModel):
    processed_text: str = Field(..., min_length=1)
    prediction: Literal["spam", "ham", "fake", "real"]
    satisfied: bool

    class Config:
        json_schema_extra = {
            "example": {
                "processed_text": "win free money now",
                "prediction": "spam",
                "satisfied": True,
            }
        }

class FeedbackResponse(BaseModel):
    success: bool = True
    message: str
    stored_label: str
    feedback_counts: Dict[str, int]
    retrain_triggered: bool = False

    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "message": "Feedback stored. Thank you!",
                "stored_label": "spam",
                "feedback_counts": {"spam": 5, "fake_news": 3, "total": 8},
                "retrain_triggered": False,
            }
        }

class RetrainResponse(BaseModel):
    success: bool
    message: str
    feedback_counts: Dict[str, int]