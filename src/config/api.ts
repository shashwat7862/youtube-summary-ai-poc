// API Configuration constants

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

export const ENDPOINTS = {
  SUMMARY: '/summary',
  HISTORY: '/history',
  QUERY: '/query',
  HEALTH: '/health',
  TRANSCRIPT: (videoId: string) => `/summary/${videoId}/transcript`,
  VIDEO_DELETE: (videoId: string) => `/history/${videoId}`,
  VIDEO_SUMMARY: (videoId: string) => `/summary/${videoId}`,
} as const;

// Request/Response status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  TIMEOUT: 408,
  QUOTA_EXCEEDED: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// API response messages
export const API_MESSAGES = {
  SUCCESS: 'Operation completed successfully',
  PROCESSING: 'Video is being processed',
  FAILED: 'Operation failed',
  INVALID_URL: 'Invalid YouTube URL provided',
  VIDEO_NOT_FOUND: 'Video not found',
  NETWORK_ERROR: 'Network connection error',
} as const;