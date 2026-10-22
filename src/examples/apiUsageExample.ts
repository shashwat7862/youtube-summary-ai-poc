// Example usage of API service and hooks

import { useSummaryApi, useHistoryApi, useQueryApi } from '@/hooks/useApi';

// Example component showing how to use the API hooks
export function ExampleComponent() {
  const { data: summaryData, loading: summaryLoading, error: summaryError, generateSummary } = useSummaryApi();
  const { data: historyData, loading: historyLoading, getHistory } = useHistoryApi();
  const { data: queryData, loading: queryLoading, queryAI } = useQueryApi();

  // Example: Generate summary
  const handleGenerateSummary = async (videoUrl: string) => {
    try {
      const result = await generateSummary(videoUrl);
      if (result.success) {
        console.log('Summary generated:', result.data);
      } else {
        console.error('Failed to generate summary:', result.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Example: Get history
  const handleGetHistory = async () => {
    try {
      const result = await getHistory({
        page: 1,
        limit: 10,
        status: 'completed'
      });
      if (result.success) {
        console.log('History loaded:', result.data);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  // Example: Query AI
  const handleQueryAI = async (question: string, videoId?: string) => {
    try {
      const result = await queryAI(question, videoId);
      if (result.success) {
        console.log('AI response:', result.data.response);
        if (result.data.suggestions) {
          console.log('Suggestions:', result.data.suggestions);
        }
      }
    } catch (error) {
      console.error('Error querying AI:', error);
    }
  };

  return {
    // States
    summaryData,
    summaryLoading,
    summaryError,
    historyData,
    historyLoading,
    queryData,
    queryLoading,
    
    // Actions
    handleGenerateSummary,
    handleGetHistory,
    handleQueryAI
  };
}

// Example: Direct API service usage (without hooks)
import apiService from '@/services/apiService';

export const directApiExample = {
  // Generate video summary
  generateSummary: async (videoUrl: string) => {
    const response = await apiService.generateSummary(videoUrl);
    return response;
  },

  // Get history with filters
  getFilteredHistory: async (search?: string, status?: string) => {
    const response = await apiService.getHistory({
      search,
      status,
      page: 1,
      limit: 20
    });
    return response;
  },

  // Query AI about specific video
  askAboutVideo: async (videoId: string, question: string) => {
    const response = await apiService.queryAI(question, videoId);
    return response;
  },

  // General AI query
  askGeneral: async (question: string) => {
    const response = await apiService.queryAI(question);
    return response;
  },

  // Get transcript
  getTranscript: async (videoId: string) => {
    const response = await apiService.getTranscript(videoId);
    return response;
  },

  // Delete video
  deleteVideo: async (videoId: string) => {
    const response = await apiService.deleteVideo(videoId);
    return response;
  },

  // Health check
  checkHealth: async () => {
    const response = await apiService.healthCheck();
    return response;
  }
};