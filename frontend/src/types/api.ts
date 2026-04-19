export type DetectionMode = 'auto' | 'spam' | 'news';

export type SpamPrediction = 'spam' | 'ham';
export type NewsPrediction = 'fake' | 'real';
export type Prediction = SpamPrediction | NewsPrediction;

export interface TextRequest {
  text: string;
}

export interface BaseResponse {
  success: boolean;
  prediction: Prediction;
  confidence: number;
  processed_text: string;
  probabilities: Record<string, number>;
}

export interface SpamResponse extends BaseResponse {
  prediction: SpamPrediction;
  probabilities: {
    ham: number;
    spam: number;
  };
}

export interface FakeNewsResponse extends BaseResponse {
  prediction: NewsPrediction;
  probabilities: {
    fake: number;
    real: number;
  };
}

export interface ContentAnalysis {
  word_count: number;
  news_keywords: string[];
  sms_keywords: string[];
  has_excessive_punctuation: boolean;
  classified_as: 'sms' | 'news';
}

export interface AutoDetectResponse extends BaseResponse {
  content_type: 'sms' | 'news';
  content_analysis: ContentAnalysis;
  detector_used: 'spam_detector' | 'fake_news_detector';
}

export interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  models_loaded: {
    spam_detector: boolean;
    spam_vectorizer: boolean;
    fake_news_detector: boolean;
    fake_news_vectorizer: boolean;
  };
  all_models_ready: boolean;
}

export interface ApiError {
  success: false;
  error: string;
  detail?: string;
}

export type ApiResponse = 
  | SpamResponse 
  | FakeNewsResponse 
  | AutoDetectResponse 
  | ApiError;

export interface DetectionResult {
  mode: DetectionMode;
  prediction: Prediction;
  confidence: number;
  probabilities: Record<string, number>;
  contentAnalysis?: ContentAnalysis;
  timestamp: number;
}