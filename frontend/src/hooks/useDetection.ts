import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import type { 
  DetectionMode, 
  DetectionResult, 
  SpamResponse, 
  FakeNewsResponse,
  AutoDetectResponse 
} from '@/types/api';

interface UseDetectionReturn {
  isLoading: boolean;
  error: string | null;
  result: DetectionResult | null;
  analyze: (text: string, mode: DetectionMode) => Promise<void>;
  reset: () => void;
}

export function useDetection(): UseDetectionReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DetectionResult | null>(null);

  const analyze = useCallback(async (text: string, mode: DetectionMode) => {
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      let response: SpamResponse | FakeNewsResponse | AutoDetectResponse;

      switch (mode) {
        case 'spam':
          response = await apiClient.detectSpam(text);
          break;
        case 'news':
          response = await apiClient.detectFakeNews(text);
          break;
        case 'auto':
          response = await apiClient.autoDetect(text);
          break;
        default:
          throw new Error('Invalid detection mode');
      }

      const detectionResult: DetectionResult = {
        mode,
        prediction: response.prediction,
        confidence: response.confidence,
        probabilities: response.probabilities,
        contentAnalysis: 'content_analysis' in response 
          ? response.content_analysis 
          : undefined,
        timestamp: Date.now(),
      };

      setResult(detectionResult);
    } catch (err) {
      const errorMessage = apiClient.handleError(err);
      setError(errorMessage);
      console.error('Detection error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setResult(null);
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    error,
    result,
    analyze,
    reset,
  };
}