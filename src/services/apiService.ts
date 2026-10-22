// API Service for Video Summarizer
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Types for API requests and responses
export interface SummaryRequest {
  videoUrl: string;
}

export interface SummaryResponse {
  success: boolean;
  data: {
    id: string;
    videoUrl: string;
    title: string;
    author: string;
    duration: string;
    transcript: string;
    summary: string;
    keyPoints: string[];
    tags: string[];
    createdAt: string;
  };
  message?: string;
}

export interface HistoryResponse {
  success: boolean;
  data: Array<{
    id: string;
    videoUrl: string;
    title: string;
    author: string;
    duration: string;
    summaryLength: number;
    status: 'completed' | 'processing' | 'failed';
    createdAt: string;
    updatedAt: string;
  }>;
  message?: string;
}

export interface QueryRequest {
  videoId?: string;
  query: string;
  context?: string;
}

export interface QueryResponse {
  success: boolean;
  data: {
    response: string;
    suggestions?: string[];
    relatedVideos?: Array<{
      id: string;
      title: string;
      relevanceScore: number;
    }>;
  };
  message?: string;
}

// Generic API response wrapper
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// HTTP client configuration
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const config: RequestInit = {
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // GET request
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    return this.request<T>(endpoint + (params ? `?${url.searchParams.toString()}` : ''), {
      method: 'GET',
    });
  }

  // POST request
  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

// Create API client instance
const apiClient = new ApiClient(API_BASE_URL);

// API Service methods
export const apiService = {
  // Generate video summary
  generateSummary: async (videoUrl: string): Promise<SummaryResponse> => {
    const response = await apiClient.post<SummaryResponse['data']>('/summary', {
      videoUrl
    });

    return {
      success: response.success,
      data: response.data!,
      message: response.error || response.message
    };
  },

  // Get video summary by ID
  getSummary: async (videoId: string): Promise<SummaryResponse> => {
    const response = await apiClient.get<SummaryResponse['data']>(`/summary/${videoId}`);

    return {
      success: response.success,
      data: response.data!,
      message: response.error || response.message
    };
  },

  // Get user's video history
  getHistory: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<HistoryResponse> => {
    const queryParams: Record<string, string> = {};
    
    if (params) {
      if (params.page) queryParams.page = params.page.toString();
      if (params.limit) queryParams.limit = params.limit.toString();
      if (params.status) queryParams.status = params.status;
      if (params.search) queryParams.search = params.search;
    }

    const response = await apiClient.get<HistoryResponse['data']>('/history', queryParams);

    return {
      success: response.success,
      data: response.data || [],
      message: response.error || response.message
    };
  },

  // Delete video from history
  deleteVideo: async (videoId: string): Promise<ApiResponse<null>> => {
    return apiClient.delete(`/history/${videoId}`);
  },

  // Query AI about video content
  queryAI: async (query: string, videoId?: string, context?: string): Promise<QueryResponse> => {
    const response = await apiClient.post<QueryResponse['data']>('/query', {
      query,
      videoId,
      context
    });

    return {
      success: response.success,
      data: response.data!,
      message: response.error || response.message
    };
  },

  // Get video transcript
  getTranscript: async (videoId: string): Promise<ApiResponse<{ transcript: string }>> => {
    return apiClient.get(`/summary/${videoId}/transcript`);
  },

  // Health check
  healthCheck: async (): Promise<ApiResponse<{ status: string; timestamp: string }>> => {
    return apiClient.get('/health');
  }
};

// Export default
export default apiService;

// Re-export types for convenience
export type {
  SummaryRequest,
  SummaryResponse,
  HistoryResponse,
  QueryRequest,
  QueryResponse
};