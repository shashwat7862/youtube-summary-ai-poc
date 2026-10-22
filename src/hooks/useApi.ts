import { useState, useCallback } from 'react';
import apiService, { SummaryResponse, HistoryResponse, QueryResponse } from '@/services/apiService';

// Generic API hook for handling loading states and errors
export function useApi<T>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
}

// Specific hooks for each API endpoint
export function useSummaryApi() {
  const { data, loading, error, execute, reset } = useApi<SummaryResponse>();

  const generateSummary = useCallback(
    (videoUrl: string) => execute(() => apiService.generateSummary(videoUrl)),
    [execute]
  );

  const getSummary = useCallback(
    (videoId: string) => execute(() => apiService.getSummary(videoId)),
    [execute]
  );

  return {
    data,
    loading,
    error,
    generateSummary,
    getSummary,
    reset
  };
}

export function useHistoryApi() {
  const { data, loading, error, execute, reset } = useApi<HistoryResponse>();

  const getHistory = useCallback(
    (params?: {
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
    }) => execute(() => apiService.getHistory(params)),
    [execute]
  );

  const deleteVideo = useCallback(
    (videoId: string) => execute(() => apiService.deleteVideo(videoId)),
    [execute]
  );

  return {
    data,
    loading,
    error,
    getHistory,
    deleteVideo,
    reset
  };
}

export function useQueryApi() {
  const { data, loading, error, execute, reset } = useApi<QueryResponse>();

  const queryAI = useCallback(
    (query: string, videoId?: string, context?: string) => 
      execute(() => apiService.queryAI(query, videoId, context)),
    [execute]
  );

  return {
    data,
    loading,
    error,
    queryAI,
    reset
  };
}

// Hook for transcript
export function useTranscriptApi() {
  const { data, loading, error, execute, reset } = useApi<{ transcript: string }>();

  const getTranscript = useCallback(
    (videoId: string) => execute(() => apiService.getTranscript(videoId)),
    [execute]
  );

  return {
    data,
    loading,
    error,
    getTranscript,
    reset
  };
}