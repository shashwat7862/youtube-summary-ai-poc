import React from "react";

export default function RawEvents() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Raw Events
        </h3>
        <div className="text-gray-500 dark:text-gray-400">
          <p className="mb-4">
            Raw event logs and system-level data for debugging and detailed analysis.
          </p>

          {/* Filter Controls */}
          <div className="mb-4 flex items-center space-x-4">
            <div>
              <select className="h-9 w-32 appearance-none rounded-lg border border-gray-300 bg-white dark:bg-gray-900 px-3 py-1 text-sm shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none text-gray-700 dark:text-gray-300">
                <option value="all">All Events</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>
            <div>
              <button className="h-9 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Export Logs
              </button>
            </div>
          </div>

          {/* Raw Events Log */}
          <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 font-mono text-xs overflow-x-auto max-h-96 overflow-y-auto">
            <div className="space-y-1 text-green-400">
              <div className="flex">
                <span className="text-gray-500 w-20">14:32:15</span>
                <span className="text-blue-400 w-16">INFO</span>
                <span>call.initiated | session_id=sess_abc123 | phone=+4723456789</span>
              </div>
              <div className="flex">
                <span className="text-gray-500 w-20">14:32:16</span>
                <span className="text-blue-400 w-16">INFO</span>
                <span>sip.dialing | call_id=call_001 | provider=twilio</span>
              </div>
              <div className="flex">
                <span className="text-gray-500 w-20">14:32:18</span>
                <span className="text-green-400 w-16">INFO</span>
                <span>call.connected | duration=0 | audio_codec=G.711</span>
              </div>
              <div className="flex">
                <span className="text-gray-500 w-20">14:32:18</span>
                <span className="text-blue-400 w-16">INFO</span>
                <span>recording.started | file_id=rec_xyz789 | quality=high</span>
              </div>
              <div className="flex">
                <span className="text-gray-500 w-20">14:32:20</span>
                <span className="text-purple-400 w-16">INFO</span>
                <span>ai.transcription.started | model=whisper-v3 | language=auto</span>
              </div>
              <div className="flex">
                <span className="text-gray-500 w-20">14:32:22</span>
                <span className="text-purple-400 w-16">INFO</span>
                <span>ai.sentiment.analysis | confidence=0.94 | sentiment=neutral</span>
              </div>
              <div className="flex">
                <span className="text-gray-500 w-20">14:33:45</span>
                <span className="text-yellow-400 w-16">WARN</span>
                <span>audio.quality.degraded | snr=12db | packet_loss=2%</span>
              </div>
              <div className="flex">
                <span className="text-gray-500 w-20">14:35:12</span>
                <span className="text-blue-400 w-16">INFO</span>
                <span>nlp.entity.extracted | type=payment_date | value="next_friday"</span>
              </div>
              <div className="flex">
                <span className="text-gray-500 w-20">14:35:42</span>
                <span className="text-green-400 w-16">INFO</span>
                <span>action.identified | type=follow_up | priority=medium</span>
              </div>
              <div className="flex">
                <span className="text-gray-500 w-20">14:36:15</span>
                <span className="text-purple-400 w-16">INFO</span>
                <span>crm.update | customer_id=cust_001 | field=last_contact</span>
              </div>
              <div className="flex">
                <span className="text-gray-500 w-20">14:38:15</span>
                <span className="text-blue-400 w-16">INFO</span>
                <span>call.ended | duration=357s | reason=customer_hangup</span>
              </div>
              <div className="flex">
                <span className="text-gray-500 w-20">14:38:16</span>
                <span className="text-green-400 w-16">INFO</span>
                <span>recording.finalized | size=4.2MB | format=wav</span>
              </div>
              <div className="flex">
                <span className="text-gray-500 w-20">14:38:18</span>
                <span className="text-blue-400 w-16">INFO</span>
                <span>transcript.generated | words=847 | accuracy=96%</span>
              </div>
              <div className="flex">
                <span className="text-gray-500 w-20">14:38:20</span>
                <span className="text-green-400 w-16">INFO</span>
                <span>session.completed | status=success | data_points=12</span>
              </div>
            </div>
          </div>

          {/* Event Statistics */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">847</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Total Events</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="text-sm font-semibold text-green-600">812</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Info Events</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="text-sm font-semibold text-yellow-600">34</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Warnings</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="text-sm font-semibold text-red-600">1</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Errors</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}