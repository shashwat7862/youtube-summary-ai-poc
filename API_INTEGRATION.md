# Video Summarizer API Integration

## Overview
The Video to Summary page now includes full API integration that hits the `/summary` endpoint when the Summary button is clicked.

## API Details

### Endpoint
- **URL**: `POST {API_BASE_URL}/summary`
- **Content-Type**: `application/json`

### Request Format
```json
{
  "videoUrl": "https://www.youtube.com/watch?v=abc123"
}
```

### Expected Response Format
```json
{
  "videoLink": "https://www.youtube.com/watch?v=abc123",
  "transcribeText": "Full video transcript with timestamps...",
  "summaryText": "AI-generated summary of the video content..."
}
```

## Configuration

### Environment Variables
Set the API base URL in your `.env` file:
```
VITE_API_BASE_URL=http://localhost:3001/api
```

## Features Implemented

### 1. **API Service** (`src/services/videoSummaryApi.ts`)
- Clean API service class with error handling
- TypeScript interfaces for request/response
- Custom React hook for state management
- Mock data fallback when API is unavailable

### 2. **VideoToSummary Component** (`src/pages/VideoSummary/VideoToSummary.tsx`)
- Full YouTube URL validation
- Loading states with animated processing text
- Error handling with user-friendly messages
- Results display with transcript and summary
- Copy to clipboard functionality

### 3. **User Experience Features**
- **Loading Animation**: Rotating processing messages during API call
- **Error Handling**: Clear error messages if API fails
- **Mock Data**: Works even without backend for development
- **Copy Functions**: Copy transcript or summary to clipboard
- **Reset Functionality**: Clear results and start new summary

## Usage

1. **Enter YouTube URL**: Paste any valid YouTube URL
2. **Click Summary**: Button triggers API call to `/summary` endpoint  
3. **Processing**: Shows loading animation with rotating text
4. **Results**: Displays transcript and summary from API response
5. **Actions**: Copy transcript/summary or start new analysis

## API Behavior

### With Backend Available
- Makes real HTTP POST request to `/summary` endpoint
- Displays actual API response data
- Shows real error messages from backend

### Without Backend (Development)
- Automatically falls back to mock data
- Simulates 3-5 second processing delay
- Shows sample transcript and summary
- Logs "API not available, using mock data" message

## Error Handling

- **Network Errors**: Falls back to mock data
- **HTTP Errors**: Shows specific error message
- **Validation Errors**: Prevents invalid YouTube URLs
- **Timeout Handling**: Built into fetch with error recovery

## Next Steps

1. **Backend Setup**: Implement the `/summary` endpoint
2. **Authentication**: Add API keys if needed  
3. **Rate Limiting**: Handle API rate limits
4. **Caching**: Store results in History page
5. **Real-time Updates**: WebSocket for long processing jobs