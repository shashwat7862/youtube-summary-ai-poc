import React from "react";

export default function Trace() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Call Trace
        </h3>
        <div className="text-gray-500 dark:text-gray-400">
          <p className="mb-4">
            Detailed trace information and execution flow for call processing and analysis.
          </p>

          {/* Trace Timeline */}
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Call Initiated</h4>
                  <span className="text-xs text-gray-500">14:32:15</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Outbound call initiated to +47 23 45 67 89
                </p>
                <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                  ✓ Connection established
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Call Connected</h4>
                  <span className="text-xs text-gray-500">14:32:18</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Customer answered the call
                </p>
                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  📊 Recording started • Audio quality: Good
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mt-2"></div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">AI Processing Started</h4>
                  <span className="text-xs text-gray-500">14:32:20</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Real-time transcription and sentiment analysis initiated
                </p>
                <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                  🤖 Model: collections-v2.1 • Confidence: 94%
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-3 h-3 bg-purple-500 rounded-full mt-2"></div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Data Extraction</h4>
                  <span className="text-xs text-gray-500">14:35:42</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Key information extracted: Payment commitment, Contact details
                </p>
                <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                  📋 Action items identified: 2 • Follow-up required: Yes
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-3 h-3 bg-gray-500 rounded-full mt-2"></div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Call Ended</h4>
                  <span className="text-xs text-gray-500">14:38:15</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Call duration: 5 minutes 57 seconds
                </p>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  💾 Recording saved • Transcript generated • Summary created
                </div>
              </div>
            </div>
          </div>

          {/* Trace Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">5:57</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Call Duration</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">94%</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Processing Accuracy</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">1.2s</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Avg Response Time</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">7</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Processing Steps</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}