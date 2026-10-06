import { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";

export default function BasicTables() {
  const [activeTab, setActiveTab] = useState("today");
  const [searchTerm, setSearchTerm] = useState("");

  const tabs = [
    { id: "today", label: "Today" },
    { id: "archive", label: "Archive" }
  ];

  // Statistics data with appropriate colors
  const stats = [
    { value: "412", label: "Customers outreached", color: "border-t-blue-500" },
    { value: "318", label: "Ready", color: "border-t-blue-500" },
    { value: "27", label: "Blocked", color: "border-t-red-500" },
    { value: "54", label: "In progress", color: "border-t-yellow-500" },
    { value: "301", label: "Completed", color: "border-t-green-500" },
    { value: "9", label: "Critical exceptions", color: "border-t-red-500" }
  ];

  // Filter options
  const filters = [
    "Validation: all",
    "Failure reason: all",
    "Planned time: all",
    "Call status: all"
  ];

  // Sample table data with phone numbers
  const tableData = [
    {
      customer: "Univar Solutions B.V.",
      id: "180784",
      invoice: "61635315, 61635316",
      openAmount: "NOK 147,858.75",
      worklistScore: "76/100",
      contact: "ORDRE_NO@univarsolutions.com",
      phone: "+47 23 45 67 89",
      validation: "Passed",
      failureReason: "—",
      plannedTime: "09:40",
      callStatus: "Completed"
    },
    {
      customer: "Nordic Pharma AS",
      id: "359912",
      invoice: "61635410",
      openAmount: "NOK 22,140.00",
      worklistScore: "92/100",
      contact: "ap.nordicpharma@nordicpharma.no",
      phone: "+47 22 98 76 54",
      validation: "Failed",
      failureReason: "Session creation failed after 3 attempts",
      plannedTime: "10:15",
      callStatus: "Blocked"
    },
    {
      customer: "Delta",
      id: "",
      invoice: "61635488,",
      openAmount: "GBP",
      worklistScore: "58/100",
      contact: "finance@deltamedical.co.uk",
      phone: "+44 20 7123 4567",
      validation: "Warning",
      failureReason: "Missing",
      plannedTime: "11:05",
      callStatus: "In"
    }
  ];

  // Filter table data based on search term
  const filteredTableData = tableData.filter(row => 
    row.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.invoice.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.validation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.failureReason.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.callStatus.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getValidationBadge = (validation: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (validation) {
      case "Passed":
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
      case "Failed":
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
      case "Warning":
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200`;
    }
  };

  const getCallStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "Completed":
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
      case "Blocked":
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
      case "In":
        return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200`;
    }
  };

  const renderTodayContent = () => (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`bg-white dark:bg-gray-800 rounded-lg p-4 border-t-4 ${stat.color}`}
          >
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Today's Worklist Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            TODAY'S WORKLIST
            {searchTerm && (
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                ({filteredTableData.length} results)
              </span>
            )}
          </h2>
          
          {/* Filters and Search Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {filters.map((filter, index) => (
                <button
                  key={index}
                  className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {filter}
                </button>
              ))}
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search customers, invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-[280px]"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto custom-scrollbar">
            {filteredTableData.length === 0 && searchTerm ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p className="text-lg mb-2">No results found for "{searchTerm}"</p>
                <p className="text-sm">Try adjusting your search terms or clear the search to see all records.</p>
                <button 
                  onClick={() => setSearchTerm("")}
                  className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300 min-w-[180px]">
                      CUSTOMER
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300 min-w-[140px]">
                      INVOICE(S)
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                      OPEN AMOUNT
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                      WORKLIST SCORE
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300 min-w-[200px]">
                      CONTACT
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300 min-w-[140px]">
                      PHONE
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300 min-w-[100px]">
                      VALIDATION
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300 min-w-[200px]">
                      FAILURE REASON
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300 min-w-[100px]">
                      PLANNED TIME
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300 min-w-[100px]">
                      CALL STATUS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTableData.map((row, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-4 px-2 min-w-[180px]">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {row.customer}
                          </div>
                          {row.id && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {row.id}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-2 text-gray-700 dark:text-gray-300 min-w-[140px]">
                        {row.invoice}
                      </td>
                      <td className="py-4 px-2 text-gray-700 dark:text-gray-300 min-w-[120px]">
                        {row.openAmount}
                      </td>
                      <td className="py-4 px-2 text-gray-700 dark:text-gray-300 min-w-[120px]">
                        {row.worklistScore}
                      </td>
                      <td className="py-4 px-2 text-gray-700 dark:text-gray-300 min-w-[200px]">
                        {row.contact}
                      </td>
                      <td className="py-4 px-2 text-gray-700 dark:text-gray-300 min-w-[140px]">
                        {row.phone}
                      </td>
                      <td className="py-4 px-2 min-w-[100px]">
                        <span className={getValidationBadge(row.validation)}>
                          {row.validation}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-gray-700 dark:text-gray-300 min-w-[200px]">
                        {row.failureReason}
                      </td>
                      <td className="py-4 px-2 text-gray-700 dark:text-gray-300 min-w-[100px]">
                        {row.plannedTime}
                      </td>
                      <td className="py-4 px-2 min-w-[100px]">
                        <span className={getCallStatusBadge(row.callStatus)}>
                          {row.callStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderArchiveContent = () => (
    <div className="space-y-6">
      <ComponentCard title="Archive Data">
        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
          <p>Archive data will be displayed here.</p>
          <p className="text-sm mt-2">Historical records and past data entries.</p>
        </div>
      </ComponentCard>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "today":
        return renderTodayContent();
      case "archive":
        return renderArchiveContent();
      default:
        return null;
    }
  };

  return (
    <>
      <PageMeta
        title="Today Dashboard | TailAdmin - Collections Dashboard"
        description="Today's operation health dashboard for collections management"
      />
      
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Today — is today's operation healthy?
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Level 1 · Friday, Sep 25 2026 · updated 2 min ago
        </p>
      </div>
      
      {/* Tabs Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                  ${activeTab === tab.id
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400 dark:border-purple-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }
                `}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </>
  );
}