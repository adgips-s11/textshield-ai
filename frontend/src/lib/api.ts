import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  TextRequest,
  SpamResponse,
  FakeNewsResponse,
  AutoDetectResponse,
  HealthResponse,
  ApiError,
} from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(
      (config) => {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        console.error('[API Error]', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  async detectSpam(text: string): Promise<SpamResponse> {
    const response = await this.client.post<SpamResponse>(
      '/api/detect-spam',
      { text } as TextRequest
    );
    return response.data;
  }

  async detectFakeNews(text: string): Promise<FakeNewsResponse> {
    const response = await this.client.post<FakeNewsResponse>(
      '/api/detect-fake-news',
      { text } as TextRequest
    );
    return response.data;
  }

  async autoDetect(text: string): Promise<AutoDetectResponse> {
    const response = await this.client.post<AutoDetectResponse>(
      '/api/auto-detect',
      { text } as TextRequest
    );
    return response.data;
  }

  async healthCheck(): Promise<HealthResponse> {
    const response = await this.client.get<HealthResponse>('/api/health');
    return response.data;
  }

  handleError(error: unknown): string {
    if (axios.isAxiosError(error)) {
      const apiError = error.response?.data as ApiError;
      return apiError?.error || apiError?.detail || error.message;
    }
    return 'An unexpected error occurred';
  }
}

export const apiClient = new ApiClient();

export const detectSpam = (text: string) => apiClient.detectSpam(text);
export const detectFakeNews = (text: string) => apiClient.detectFakeNews(text);
export const autoDetect = (text: string) => apiClient.autoDetect(text);
export const healthCheck = () => apiClient.healthCheck();