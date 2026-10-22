import React, { useState, useEffect } from "react";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { VideoIcon, PlayIcon, CheckCircleIcon } from "@/icons";
import { useVideoSummaryApi } from "@/services/videoSummaryApi";

const VideoToSummary: React.FC = () => {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [currentProcessText, setCurrentProcessText] = useState("");
  const [processInterval, setProcessInterval] = useState<NodeJS.Timeout | null>(null);

  // Use the API hook
  const { loading: isProcessing, error: apiError, data: summaryData, generateSummary, reset } = useVideoSummaryApi();

  // Processing text labels that rotate during processing
  const processingTexts = [
    "Extracting Audio...",
    "Processing Audio...",
    "Extracting Text...",
    "Processing and Saving...",
    "Summarizing the Video..."
  ];

  const handleSummary = async () => {
    if (!youtubeUrl.trim() || !isValidYouTubeUrl(youtubeUrl)) return;
    
    reset(); // Clear previous data
    
    // Start processing text rotation
    let textIndex = 0;
    setCurrentProcessText(processingTexts[textIndex]);
    const interval = setInterval(() => {
      textIndex = (textIndex + 1) % processingTexts.length;
      setCurrentProcessText(processingTexts[textIndex]);
    }, 2000);
    setProcessInterval(interval);

    try {
      await generateSummary(youtubeUrl);
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      // Clean up interval
      if (interval) {
        clearInterval(interval);
        setProcessInterval(null);
      }
      setCurrentProcessText("");
    }
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (processInterval) {
        clearInterval(processInterval);
      }
    };
  }, [processInterval]);

  const isValidYouTubeUrl = (url: string) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <PageMeta
        title="Video to Summary | Video Summerizer"
        description="Generate AI-powered summaries from YouTube videos"
      />
      
      <div className="mx-auto w-full max-w-[1080px]">
        <PageBreadcrumb pageTitle="Video to Summary" />
        
        <div className="grid grid-cols-1 gap-6">
          <ComponentCard title="YouTube Video Summarizer">
            <div className="space-y-6">
              {/* YouTube URL Input */}
              <div className="space-y-2">
                <label htmlFor="youtube-url" className="block text-sm font-medium text-gray-900 dark:text-white">
                  YouTube Video URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <VideoIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="youtube-url"
                    type="url"
                    className="block w-full rounded-lg border border-gray-300 bg-white p-3 ps-10 text-sm text-gray-900 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-brand-500 dark:focus:ring-brand-500"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    disabled={isProcessing}
                  />
                </div>
                {youtubeUrl && !isValidYouTubeUrl(youtubeUrl) && (
                  <p className="text-sm text-error-600 dark:text-error-400">
                    Please enter a valid YouTube URL
                  </p>
                )}
              </div>

              {/* Summary Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleSummary}
                  disabled={!youtubeUrl.trim() || !isValidYouTubeUrl(youtubeUrl) || isProcessing}
                  className="inline-flex items-center rounded-lg bg-brand-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white me-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <PlayIcon className="h-4 w-4 me-2" />
                      Summary
                    </>
                  )}
                </button>
              </div>

              {/* Video Preview */}
              {youtubeUrl && isValidYouTubeUrl(youtubeUrl) && !isProcessing && !summaryData && (
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <div className="flex items-center space-x-3">
                    <VideoIcon className="h-8 w-8 text-brand-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        YouTube Video Ready
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {youtubeUrl}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* API Error Display */}
              {apiError && (
                <div className="rounded-lg bg-error-50 border border-error-200 p-4 dark:bg-error-900/20 dark:border-error-800">
                  <div className="flex items-center space-x-2">
                    <div className="h-5 w-5 text-error-600 dark:text-error-400">⚠️</div>
                    <div>
                      <p className="text-sm font-medium text-error-800 dark:text-error-200">
                        Error processing video
                      </p>
                      <p className="text-sm text-error-600 dark:text-error-400 mt-1">
                        {apiError}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Processing Loader */}
              {isProcessing && (
                <div className="rounded-lg bg-gradient-to-br from-brand-50 to-blue-50 border border-brand-200 p-8 text-center dark:from-gray-800 dark:to-gray-700 dark:border-gray-600">
                  <div className="flex flex-col items-center space-y-6">
                    {/* Spinner */}
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin dark:border-gray-600 dark:border-t-brand-400"></div>
                      <VideoIcon className="absolute inset-0 m-auto h-6 w-6 text-brand-600 dark:text-brand-400" />
                    </div>
                    
                    {/* Processing Text */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Processing Video
                      </h3>
                      <p className="text-brand-600 dark:text-brand-400 font-medium text-base animate-pulse">
                        {currentProcessText}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Please wait while we analyze your video...
                      </p>
                    </div>
                    
                    {/* Animated dots */}
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ComponentCard>

          {/* Summary Results Section */}
          {summaryData && (
            <ComponentCard title="AI Generated Summary">
              <div className="space-y-6">
                {/* Video Information Header */}
                <div className="border-b border-gray-200 pb-4 dark:border-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {summaryData.title || "Video Summary"}
                      </h3>
                      {summaryData.message && (
                        <p className="mt-1 text-sm text-success-600 dark:text-success-400">
                          {summaryData.message}
                        </p>
                      )}
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <VideoIcon className="h-4 w-4" />
                          <span className="max-w-md truncate">{youtubeUrl}</span>
                        </div>
                        <div className="text-xs">
                          Video ID: {summaryData.video_id}
                        </div>
                        <div className="text-xs">
                          Generated: {new Date().toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transcript Section */}
                {summaryData.txt_file && (
                  <div>
                    <h4 className="mb-3 text-base font-medium text-gray-900 dark:text-white">
                      Video Transcript
                    </h4>
                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50 max-h-60 overflow-y-auto">
                      <pre className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans">
                        {summaryData.txt_file}
                      </pre>
                    </div>
                  </div>
                )}

                {/* AI Summary */}
                {summaryData.summary && (
                  <div>
                    <h4 className="mb-3 text-base font-medium text-gray-900 dark:text-white">
                      AI Generated Summary
                    </h4>
                    <div className="rounded-lg bg-gradient-to-br from-brand-50 to-blue-50 p-4 dark:from-gray-800 dark:to-gray-700 border border-brand-100 dark:border-gray-600">
                      <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                        {summaryData.summary}
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button 
                    onClick={() => copyToClipboard(summaryData.summary || '')}
                    className="inline-flex items-center rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                  >
                    <CheckCircleIcon className="h-4 w-4 me-2" />
                    Copy Summary
                  </button>
                  <button 
                    onClick={() => copyToClipboard(summaryData.txt_file || '')}
                    className="inline-flex items-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:focus:ring-gray-400"
                  >
                    Copy Transcript
                  </button>
                  <button className="inline-flex items-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:focus:ring-gray-400">
                    Save to History
                  </button>
                  <button 
                    onClick={() => {
                      setYoutubeUrl("");
                      reset();
                    }}
                    className="inline-flex items-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:focus:ring-gray-400"
                  >
                    New Summary
                  </button>
                </div>
              </div>
            </ComponentCard>
          )}
        </div>
      </div>
    </>
  );
};

export default VideoToSummary;