import pickle
import os
from typing import Dict, Any
import logging

from app.ml.text_processor import TextPreprocessor
from app.ml.classifier import ContentTypeClassifier
from app.core.config import settings

logger = logging.getLogger(__name__)


class ModelPredictor:
    def __init__(self):
        self.spam_model = None
        self.spam_vectorizer = None
        self.fake_news_model = None
        self.fake_news_vectorizer = None
        self.preprocessor = TextPreprocessor()
        self.content_classifier = ContentTypeClassifier()

    def load_models(self):
        try:
            if os.path.exists(settings.SPAM_MODEL_PATH):
                with open(settings.SPAM_MODEL_PATH, 'rb') as f:
                    self.spam_model = pickle.load(f)
                with open(settings.SPAM_VECTORIZER_PATH, 'rb') as f:
                    self.spam_vectorizer = pickle.load(f)
                logger.info("Spam models loaded")
            else:
                logger.warning("Spam model not found at %s", settings.SPAM_MODEL_PATH)

            if os.path.exists(settings.FAKE_NEWS_MODEL_PATH):
                with open(settings.FAKE_NEWS_MODEL_PATH, 'rb') as f:
                    self.fake_news_model = pickle.load(f)
                with open(settings.FAKE_NEWS_VECTORIZER_PATH, 'rb') as f:
                    self.fake_news_vectorizer = pickle.load(f)
                logger.info("Fake news models loaded")
            else:
                logger.warning("Fake news model not found at %s", settings.FAKE_NEWS_MODEL_PATH)

        except Exception as e:
            logger.error("Error loading models: %s", e)
            raise

    def models_loaded(self) -> bool:
        return all([
            self.spam_model is not None,
            self.spam_vectorizer is not None,
            self.fake_news_model is not None,
            self.fake_news_vectorizer is not None,
        ])

    def get_models_status(self) -> Dict[str, bool]:
        return {
            "spam_detector":        self.spam_model is not None,
            "spam_vectorizer":      self.spam_vectorizer is not None,
            "fake_news_detector":   self.fake_news_model is not None,
            "fake_news_vectorizer": self.fake_news_vectorizer is not None,
        }

    def predict_spam(self, text: str) -> Dict[str, Any]:
        if not self.spam_model or not self.spam_vectorizer:
            raise ValueError("Spam detection models not loaded")

        cleaned    = self.preprocessor.clean_text(text)
        vectorized = self.spam_vectorizer.transform([cleaned])
        prediction = self.spam_model.predict(vectorized)[0]
        probs      = self.spam_model.predict_proba(vectorized)[0]

        classes  = self.spam_model.classes_
        prob_dict = {
            classes[0]: float(probs[0] * 100),
            classes[1]: float(probs[1] * 100),
        }

        return {
            "success":        True,
            "prediction":     prediction,
            "confidence":     round(float(max(probs) * 100), 2),
            "processed_text": cleaned,
            "probabilities":  {k: round(v, 2) for k, v in prob_dict.items()},
        }

    def predict_fake_news(self, text: str) -> Dict[str, Any]:
        if not self.fake_news_model or not self.fake_news_vectorizer:
            raise ValueError("Fake news detection models not loaded")

        cleaned    = self.preprocessor.clean_text(text)
        vectorized = self.fake_news_vectorizer.transform([cleaned])
        prediction = self.fake_news_model.predict(vectorized)[0]
        probs      = self.fake_news_model.predict_proba(vectorized)[0]

        classes  = self.fake_news_model.classes_
        prob_dict = {
            classes[0]: float(probs[0] * 100),
            classes[1]: float(probs[1] * 100),
        }

        return {
            "success":        True,
            "prediction":     prediction,
            "confidence":     round(float(max(probs) * 100), 2),
            "processed_text": cleaned,
            "probabilities":  {k: round(v, 2) for k, v in prob_dict.items()},
        }

    def auto_detect(self, text: str) -> Dict[str, Any]:
        content_type     = self.content_classifier.classify_content_type(text)
        content_features = self.content_classifier.get_content_features(text)

        if content_type == 'sms':
            result        = self.predict_spam(text)
            detector_used = "spam_detector"
        else:
            result        = self.predict_fake_news(text)
            detector_used = "fake_news_detector"

        return {
            "success":          True,
            "content_type":     content_type,
            "content_analysis": content_features,
            "prediction":       result["prediction"],
            "confidence":       result["confidence"],
            "processed_text":   result["processed_text"],   # ← fix
            "detector_used":    detector_used,
            "probabilities":    result["probabilities"],
        }