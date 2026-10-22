import React from "react";

export default function ExtractedData() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Extracted Data
        </h3>
        <div className="text-gray-500 dark:text-gray-400">
          <p className="mb-4">
            Data extracted from call recordings and transcriptions for analysis and insights.
          </p>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2 font-bold text-gray-700 dark:text-gray-300">
                    Call ID
                  </th>
                  <th className="text-left py-3 px-2 font-bold text-gray-700 dark:text-gray-300">
                    Customer
                  </th>
                  <th className="text-left py-3 px-2 font-bold text-gray-700 dark:text-gray-300">
                    Key Topics
                  </th>
                  <th className="text-left py-3 px-2 font-bold text-gray-700 dark:text-gray-300">
                    Sentiment
                  </th>
                  <th className="text-left py-3 px-2 font-bold text-gray-700 dark:text-gray-300">
                    Action Items
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3 px-2 text-gray-900 dark:text-white">CALL-001</td>
                  <td className="py-3 px-2 text-gray-900 dark:text-white">Univar Solutions B.V.</td>
                  <td className="py-3 px-2 text-gray-700 dark:text-gray-300">Payment terms, Invoice dispute</td>
                  <td className="py-3 px-2">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Positive
                    </span>
                  </td>
                  <td className="py-3 px-2 text-gray-700 dark:text-gray-300">Follow up in 3 days</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3 px-2 text-gray-900 dark:text-white">CALL-002</td>
                  <td className="py-3 px-2 text-gray-900 dark:text-white">Nordic Pharma AS</td>
                  <td className="py-3 px-2 text-gray-700 dark:text-gray-300">Credit limit, Account review</td>
                  <td className="py-3 px-2">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      Neutral
                    </span>
                  </td>
                  <td className="py-3 px-2 text-gray-700 dark:text-gray-300">Send credit application</td>
                </tr>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3 px-2 text-gray-900 dark:text-white">CALL-003</td>
                  <td className="py-3 px-2 text-gray-900 dark:text-white">Delta Medical</td>
                  <td className="py-3 px-2 text-gray-700 dark:text-gray-300">Overdue payment, Extension request</td>
                  <td className="py-3 px-2">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                      Negative
                    </span>
                  </td>
                  <td className="py-3 px-2 text-gray-700 dark:text-gray-300">Legal notice required</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Extraction Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">87%</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Extraction Accuracy</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">156</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Data Points Extracted</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">42</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Action Items Generated</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}