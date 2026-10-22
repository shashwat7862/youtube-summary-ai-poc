// Simplified API service without hooks
import apiService from './apiService';

// Simple wrapper functions without React integration
export const videoApiService = {
  // Generate video summary
  async generateSummary(videoUrl: string) {
    try {
      const response = await apiService.generateSummary(videoUrl);
      return {
        success: response.success,
        data: response.data,
        error: response.message
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // Get history
  async getHistory(filters?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) {
    try {
      const response = await apiService.getHistory(filters);
      return {
        success: response.success,
        data: response.data,
        error: response.message
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // Query AI
  async queryAI(query: string, videoId?: string) {
    try {
      const response = await apiService.queryAI(query, videoId);
      return {
        success: response.success,
        data: response.data,
        error: response.message
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // Get transcript
  async getTranscript(videoId: string) {
    try {
      const response = await apiService.getTranscript(videoId);
      return {
        success: response.success,
        data: response.data,
        error: response.error
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  // Delete video
  async deleteVideo(videoId: string) {
    try {
      const response = await apiService.deleteVideo(videoId);
      return {
        success: response.success,
        error: response.error
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
};