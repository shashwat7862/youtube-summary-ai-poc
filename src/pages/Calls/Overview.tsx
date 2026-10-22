import { useState, useRef, useEffect } from "react";
import Label from "@/components/form/Label";
import DatePicker from "@/components/form/date-picker";
import { useModal } from "@/hooks/useModal";

export default function Overview() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [selectedCall, setSelectedCall] = useState<any>(null);
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null);
  const [isTranscriptModalOpen, setIsTranscriptModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  // Auto-select first call on component mount
  useEffect(() => {
    if (filteredCalls.length > 0 && !selectedCallId) {
      setSelectedCallId(filteredCalls[0].id);
    }
  }, []);

  // Sample calls data
  const callsData = [
    {
      id: "CALL-001",
      customer: "Univar Solutions B.V.",
      sessionId: "SESSION-2024-001",
      phone: "+47 23 45 67 89",
      disposition: "Payment Committed",
      invoiceNumber: "INV-2024-001234",
      status: "Completed",
      duration: "5:47",
      outcome: "Payment Committed",
      timestamp: "14:32:15",
      date: "2026-10-07",
      recordingConsent: "Yes - Verbal consent given",
      recordingReference: "REC-2024-001234-AUDIO",
      transcriptReference: "TXN-2024-001234-FULL"
    },
    {
      id: "CALL-002", 
      customer: "Nordic Pharma AS",
      sessionId: "SESSION-2024-002",
      phone: "+47 22 98 76 54",
      disposition: "No Answer",
      invoiceNumber: "INV-2024-005678",
      status: "Failed",
      duration: "2:15",
      outcome: "No Answer",
      timestamp: "11:22:30",
      date: "2026-10-07",
      recordingConsent: "N/A - Call not connected",
      recordingReference: "N/A",
      transcriptReference: "N/A"
    },
    {
      id: "CALL-003",
      customer: "Delta Medical",
      sessionId: "SESSION-2024-003",
      phone: "+44 20 7123 4567", 
      disposition: "Ongoing",
      invoiceNumber: "INV-2024-009876",
      status: "In Progress",
      duration: "3:42",
      outcome: "Ongoing",
      timestamp: "15:45:12",
      date: "2026-10-07",
      recordingConsent: "Yes - Digital consent",
      recordingReference: "REC-2024-009876-AUDIO",
      transcriptReference: "TXN-2024-009876-PARTIAL"
    },
    {
      id: "CALL-004",
      customer: "Pharma Nord AS",
      sessionId: "SESSION-2024-004",
      phone: "+45 39 17 72 00",
      disposition: "Extension Granted",
      invoiceNumber: "INV-2024-004321",
      status: "Completed",
      duration: "8:23",
      outcome: "Extension Granted",
      timestamp: "09:15:45",
      date: "2026-10-06",
      recordingConsent: "Yes - Verbal consent given",
      recordingReference: "REC-2024-004321-AUDIO",
      transcriptReference: "TXN-2024-004321-FULL"
    },
    {
      id: "CALL-005",
      customer: "BioTech Solutions",
      sessionId: "SESSION-2024-005",
      phone: "+46 8 123 456 78",
      disposition: "Pending",
      invoiceNumber: "INV-2024-007890",
      status: "Scheduled",
      duration: "—",
      outcome: "Pending",
      timestamp: "16:30:00",
      date: "2026-10-07",
      recordingConsent: "Pending",
      recordingReference: "Pending",
      transcriptReference: "Pending"
    }
  ];

  // Filter calls data
  const filteredCalls = callsData.filter(call => {
    const searchMatch = call.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.phone.includes(searchTerm) ||
      call.disposition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.sessionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Date range filter
    let dateMatch = true;
    if (dateRange.from || dateRange.to) {
      const callDate = new Date(call.date);
      const fromDate = dateRange.from ? new Date(dateRange.from) : null;
      const toDate = dateRange.to ? new Date(dateRange.to) : null;
      
      if (fromDate && toDate) {
        dateMatch = callDate >= fromDate && callDate <= toDate;
      } else if (fromDate) {
        dateMatch = callDate >= fromDate;
      } else if (toDate) {
        dateMatch = callDate <= toDate;
      }
    }
    
    return searchMatch && dateMatch;
  });

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-2 rounded-full text-xs font-medium";
    switch (status) {
      case "Completed":
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
      case "Failed":
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
      case "In Progress":
        return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`;
      case "Scheduled":
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200`;
    }
  };

  const handleViewDetails = (call: any) => {
    setSelectedCall(call);
    openModal();
  };

  const handleSelectCall = (call: any) => {
    setSelectedCallId(call.id);
    // This will update the chat section to show the selected call's summary
  };

  const handleViewFullTranscript = () => {
    setIsTranscriptModalOpen(true);
    setIsDropdownOpen(false); // Close dropdown when opening modal
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* First Section - Calls List with Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Calls Overview
            {searchTerm && (
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                ({filteredCalls.length} results)
              </span>
            )}
            {(dateRange.from || dateRange.to) && (
              <span className="text-sm font-normal text-purple-600 dark:text-purple-400 ml-2">
                (Date filtered: {dateRange.from || 'Any'} → {dateRange.to || 'Any'})
              </span>
            )}
          </h3>
          
          {/* Search and Date Filters Row */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1">
              <Label htmlFor="search-calls">Search</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  id="search-calls"
                  type="text"
                  placeholder="Search calls..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent h-11"
                />
              </div>
            </div>

            {/* Date Range Filters */}
            <div className="flex gap-3 items-end">
              <div className="w-36">
                <DatePicker
                  id="calls-date-from"
                  label="From Date"
                  placeholder="Start date"
                  className="w-full"
                  onChange={(dates, currentDateString) => {
                    setDateRange(prev => ({ ...prev, from: currentDateString }));
                  }}
                />
              </div>
              <div className="w-36">
                <DatePicker
                  id="calls-date-to"
                  label="To Date"
                  placeholder="End date"
                  className="w-full"
                  onChange={(dates, currentDateString) => {
                    setDateRange(prev => ({ ...prev, to: currentDateString }));
                  }}
                />
              </div>

              {/* Clear Date Range Button */}
              {(dateRange.from || dateRange.to) && (
                <button
                  onClick={() => setDateRange({ from: "", to: "" })}
                  className="h-11 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500/20 mb-0"
                  title="Clear date range"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Calls List - Card Layout */}
          <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
            {filteredCalls.length === 0 && searchTerm ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p className="text-sm mb-2">No calls found for "{searchTerm}"</p>
                <button 
                  onClick={() => setSearchTerm("")}
                  className="text-xs px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              filteredCalls.map((call) => (
                <div 
                  key={call.id} 
                  onClick={() => handleSelectCall(call)}
                  className={`rounded-lg border p-4 transition-all duration-200 cursor-pointer ${
                    selectedCallId === call.id 
                      ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-500 shadow-md' 
                      : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:shadow-md hover:border-purple-300 dark:hover:border-purple-500'
                  }`}
                >
                  <div className="mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-base mb-1">
                        {call.customer}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Session: {call.sessionId}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 font-medium">Disposition:</span>
                      <p className="text-gray-900 dark:text-white mt-1">
                        {call.disposition}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 font-medium">Invoice:</span>
                      <p className="text-gray-900 dark:text-white mt-1 font-mono text-xs">
                        {call.invoiceNumber}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-600">
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>📞 {call.phone}</span>
                      <span>⏱️ {call.duration}</span>
                      <span>🕐 {call.timestamp}</span>
                    </div>
                    <button
                      onClick={() => handleViewDetails(call)}
                      className="px-3 py-1.5 text-xs font-medium text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-purple-900/30 rounded-lg transition-colors flex-shrink-0"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Second Section - Chat Interface */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {selectedCallId ? (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Call Summary
                    </h3>
                    <span className="px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded text-sm font-bold tracking-wide shadow-sm">
                      {filteredCalls.find(call => call.id === selectedCallId)?.customer}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                    This call involved a healthcare equipment support request where the customer experienced technical difficulties with their CT scanner. The AI assistant successfully identified the device and initiated escalation to technical support for resolution.
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex flex-wrap gap-4 text-xs">
                      <span className="font-mono text-gray-700 dark:text-gray-300"><span className="font-semibold">Call ID:</span> call_88f2e1</span>
                      <span className="font-mono text-gray-700 dark:text-gray-300"><span className="font-semibold">Session ID:</span> sess_7a91c4</span>
                      <span className="font-mono text-gray-700 dark:text-gray-300"><span className="font-semibold">Correlation ID:</span> corr_e0d5a9</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Call Summary
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    Select a call from the list to view its conversation transcript. Today's call activities show strong customer engagement with 5 total calls processed. 
                    The system successfully completed 3 calls with positive outcomes, while 1 call failed 
                    due to no answer. Analysis indicates peak calling hours between 2-4 PM with an average 
                    call duration of 6 minutes and 87% customer satisfaction rate.
                  </p>
                </>
              )}
            </div>
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {isDropdownOpen && selectedCallId && (
                <div className="absolute right-0 top-8 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-50">
                  <button
                    onClick={handleViewFullTranscript}
                    className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    View Full Transcript
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar" style={{maxHeight: '420px'}}>
          {/* AI Opening Message */}
          <div className="flex space-x-3">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-semibold">AI</span>
            </div>
            <div className="flex-1">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                <p className="text-sm text-gray-900 dark:text-white">
                  Hi, I'm GE HealthCare's Virtual Assistant. This call will be recorded for quality purposes. How can I help you today?
                </p>
              </div>
            </div>
          </div>

          {/* Customer Response */}
          <div className="flex space-x-3 justify-end">
            <div className="flex-1 max-w-sm">
              <div className="bg-blue-500 rounded-lg px-4 py-2">
                <p className="text-sm text-white">
                  Hi. My name is Charlotte Crawley. I'm starting to log a ticket, please.
                </p>
              </div>
            </div>
            <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-semibold">C</span>
            </div>
          </div>

          {/* AI Safety Question */}
          <div className="flex space-x-3">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-semibold">AI</span>
            </div>
            <div className="flex-1">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                <p className="text-sm text-gray-900 dark:text-white">
                  Is there any patient safety concern?
                </p>
              </div>
            </div>
          </div>

          {/* Customer - No Safety Concern */}
          <div className="flex space-x-3 justify-end">
            <div className="flex-1 max-w-xs">
              <div className="bg-blue-500 rounded-lg px-4 py-2">
                <p className="text-sm text-white">
                  None.
                </p>
              </div>
            </div>
            <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-semibold">C</span>
            </div>
          </div>

          {/* AI - System ID Request */}
          <div className="flex space-x-3">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-semibold">AI</span>
            </div>
            <div className="flex-1">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                <p className="text-sm text-gray-900 dark:text-white">
                  Can you give me the serial number or system ID of the device, or a case number if you have one?
                </p>
              </div>
            </div>
          </div>

          {/* Customer - System ID */}
          <div className="flex space-x-3 justify-end">
            <div className="flex-1 max-w-sm">
              <div className="bg-blue-500 rounded-lg px-4 py-2">
                <p className="text-sm text-white">
                  Sure. The system ID is eight three one eight one seven six one one three three.
                </p>
              </div>
            </div>
            <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-semibold">C</span>
            </div>
          </div>

          {/* AI - Device Identification */}
          <div className="flex space-x-3">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-semibold">AI</span>
            </div>
            <div className="flex-1">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                <p className="text-sm text-gray-900 dark:text-white">
                  I've identified a Revo CT scanner at St Vincent's Hospital Sydney. Is that the one you're calling about?
                </p>
              </div>
            </div>
          </div>

          {/* Customer - Confirmation */}
          <div className="flex space-x-3 justify-end">
            <div className="flex-1 max-w-xs">
              <div className="bg-blue-500 rounded-lg px-4 py-2">
                <p className="text-sm text-white">
                  Yes. That's correct.
                </p>
              </div>
            </div>
            <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-semibold">C</span>
            </div>
          </div>

          {/* AI - Existing Cases Check */}
          <div className="flex space-x-3">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-semibold">AI</span>
            </div>
            <div className="flex-1">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                <p className="text-sm text-gray-900 dark:text-white">
                  I can see 43 open cases on this device — including one about noise from the tube, another about an intermittent squeaking noise from the table, and another about an unrecognised tube installed on the system. Is this one of those?
                </p>
              </div>
            </div>
          </div>

          {/* Customer - New Issue */}
          <div className="flex space-x-3 justify-end">
            <div className="flex-1 max-w-xs">
              <div className="bg-blue-500 rounded-lg px-4 py-2">
                <p className="text-sm text-white">
                  No. It's an entirely new issue.
                </p>
              </div>
            </div>
            <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-semibold">C</span>
            </div>
          </div>

          {/* AI - Problem Description */}
          <div className="flex space-x-3">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-semibold">AI</span>
            </div>
            <div className="flex-1">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                <p className="text-sm text-gray-900 dark:text-white">
                  Tell me the problem with the device.
                </p>
              </div>
            </div>
          </div>

          {/* Customer - Problem Description */}
          <div className="flex space-x-3 justify-end">
            <div className="flex-1 max-w-sm">
              <div className="bg-blue-500 rounded-lg px-4 py-2">
                <p className="text-sm text-white">
                  When scanning a patient, the protocol showed an error, and the scan couldn't complete. The error message said, "can't complete the scanning. Please contact support."
                </p>
              </div>
            </div>
            <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-semibold">C</span>
            </div>
          </div>

          {/* Customer - System Down */}
          <div className="flex space-x-3 justify-end">
            <div className="flex-1 max-w-sm">
              <div className="bg-blue-500 rounded-lg px-4 py-2">
                <p className="text-sm text-white">
                  The system's down at the moment. I'd like to speak to a remote engineer, please.
                </p>
              </div>
            </div>
            <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-semibold">C</span>
            </div>
          </div>

          {/* AI - Final Response */}
          <div className="flex space-x-3">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-semibold">AI</span>
            </div>
            <div className="flex-1">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                <p className="text-sm text-gray-900 dark:text-white">
                  I've run into a system issue while checking your details. Let me connect you to a remote engineer who can help with your CT scanner issue.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Transcript Modal */}
      {isTranscriptModalOpen && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center overflow-y-auto">
          <div
            className="fixed inset-0 h-full w-full bg-black/60 backdrop-blur-sm"
            onClick={() => setIsTranscriptModalOpen(false)}
          ></div>
          <div
            className="relative w-full max-w-4xl h-5/6 rounded-2xl bg-white dark:bg-gray-900 shadow-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsTranscriptModalOpen(false)}
              className="absolute right-3 top-3 z-999 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.04289 16.5413C5.65237 16.9318 5.65237 17.565 6.04289 17.9555C6.43342 18.346 7.06658 18.346 7.45711 17.9555L11.9987 13.4139L16.5408 17.956C16.9313 18.3466 17.5645 18.3466 17.955 17.956C18.3455 17.5655 18.3455 16.9323 17.955 16.5418L13.4129 11.9997L17.955 7.4576C18.3455 7.06707 18.3455 6.43391 17.955 6.04338C17.5645 5.65286 16.9313 5.65286 16.5408 6.04338L11.9987 10.5855L7.45711 6.0439C7.06658 5.65338 6.43342 5.65338 6.04289 6.0439C5.65237 6.43442 5.65237 7.06759 6.04289 7.45811L10.5845 11.9997L6.04289 16.5413Z"
                  fill="currentColor"
                />
              </svg>
            </button>
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-black mb-2">
                    Full Call Transcript
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Complete conversation between AI Assistant and {filteredCalls.find(call => call.id === selectedCallId)?.customer}
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Messages - Full Transcript */}
            <div className="flex-1 p-6 space-y-4 overflow-y-auto custom-scrollbar">
              {/* AI Opening Message */}
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">AI</span>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                    <p className="text-sm text-gray-900 dark:text-white">
                      Hi, I'm GE HealthCare's Virtual Assistant. This call will be recorded for quality purposes. How can I help you today?
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Response */}
              <div className="flex space-x-3 justify-end">
                <div className="flex-1 max-w-sm">
                  <div className="bg-blue-500 rounded-lg px-4 py-2">
                    <p className="text-sm text-white">
                      Hi. My name is Charlotte Crawley. I'm starting to log a ticket, please.
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">C</span>
                </div>
              </div>

              {/* AI Safety Question */}
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">AI</span>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                    <p className="text-sm text-gray-900 dark:text-white">
                      Is there any patient safety concern?
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer - No Safety Concern */}
              <div className="flex space-x-3 justify-end">
                <div className="flex-1 max-w-xs">
                  <div className="bg-blue-500 rounded-lg px-4 py-2">
                    <p className="text-sm text-white">
                      None.
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">C</span>
                </div>
              </div>

              {/* AI - System ID Request */}
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">AI</span>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                    <p className="text-sm text-gray-900 dark:text-white">
                      Can you give me the serial number or system ID of the device, or a case number if you have one?
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer - System ID */}
              <div className="flex space-x-3 justify-end">
                <div className="flex-1 max-w-sm">
                  <div className="bg-blue-500 rounded-lg px-4 py-2">
                    <p className="text-sm text-white">
                      Sure. The system ID is eight three one eight one seven six one one three three.
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">C</span>
                </div>
              </div>

              {/* AI - Device Identification */}
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">AI</span>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                    <p className="text-sm text-gray-900 dark:text-white">
                      I've identified a Revo CT scanner at St Vincent's Hospital Sydney. Is that the one you're calling about?
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer - Confirmation */}
              <div className="flex space-x-3 justify-end">
                <div className="flex-1 max-w-xs">
                  <div className="bg-blue-500 rounded-lg px-4 py-2">
                    <p className="text-sm text-white">
                      Yes. That's correct.
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">C</span>
                </div>
              </div>

              {/* AI - Existing Cases Check */}
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">AI</span>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                    <p className="text-sm text-gray-900 dark:text-white">
                      I can see 43 open cases on this device — including one about noise from the tube, another about an intermittent squeaking noise from the table, and another about an unrecognised tube installed on the system. Is this one of those?
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer - New Issue */}
              <div className="flex space-x-3 justify-end">
                <div className="flex-1 max-w-xs">
                  <div className="bg-blue-500 rounded-lg px-4 py-2">
                    <p className="text-sm text-white">
                      No. It's an entirely new issue.
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">C</span>
                </div>
              </div>

              {/* AI - Problem Description */}
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">AI</span>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                    <p className="text-sm text-gray-900 dark:text-white">
                      Tell me the problem with the device.
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer - Problem Description */}
              <div className="flex space-x-3 justify-end">
                <div className="flex-1 max-w-sm">
                  <div className="bg-blue-500 rounded-lg px-4 py-2">
                    <p className="text-sm text-white">
                      When scanning a patient, the protocol showed an error, and the scan couldn't complete. The error message said, "can't complete the scanning. Please contact support."
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">C</span>
                </div>
              </div>

              {/* Customer - System Down */}
              <div className="flex space-x-3 justify-end">
                <div className="flex-1 max-w-sm">
                  <div className="bg-blue-500 rounded-lg px-4 py-2">
                    <p className="text-sm text-white">
                      The system's down at the moment. I'd like to speak to a remote engineer, please.
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">C</span>
                </div>
              </div>

              {/* AI - Final Response */}
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">AI</span>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                    <p className="text-sm text-gray-900 dark:text-white">
                      I've run into a system issue while checking your details. Let me connect you to a remote engineer who can help with your CT scanner issue.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Transcript Modal */}
      {isTranscriptModalOpen && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center overflow-y-auto">
          <div
            className="fixed inset-0 h-full w-full bg-black/60 backdrop-blur-sm"
            onClick={() => setIsTranscriptModalOpen(false)}
          ></div>
          <div
            className="relative w-full max-w-4xl h-5/6 rounded-2xl bg-white dark:bg-gray-900 shadow-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsTranscriptModalOpen(false)}
              className="absolute right-3 top-3 z-999 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.04289 16.5413C5.65237 16.9318 5.65237 17.565 6.04289 17.9555C6.43342 18.346 7.06658 18.346 7.45711 17.9555L11.9987 13.4139L16.5408 17.956C16.9313 18.3466 17.5645 18.3466 17.955 17.956C18.3455 17.5655 18.3455 16.9323 17.955 16.5418L13.4129 11.9997L17.955 7.4576C18.3455 7.06707 18.3455 6.43391 17.955 6.04338C17.5645 5.65286 16.9313 5.65286 16.5408 6.04338L11.9987 10.5855L7.45711 6.0439C7.06658 5.65338 6.43342 5.65338 6.04289 6.0439C5.65237 6.43442 5.65237 7.06759 6.04289 7.45811L10.5845 11.9997L6.04289 16.5413Z"
                  fill="currentColor"
                />
              </svg>
            </button>
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-black mb-2">
                    Full Call Transcript
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Complete conversation between AI Assistant and {filteredCalls.find(call => call.id === selectedCallId)?.customer}
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Messages - Full Transcript */}
            <div className="flex-1 p-6 space-y-4 overflow-y-auto custom-scrollbar">
              {/* AI Opening Message */}
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">AI</span>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                    <p className="text-sm text-gray-900 dark:text-white">
                      Hi, I'm GE HealthCare's Virtual Assistant. This call will be recorded for quality purposes. How can I help you today?
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Response */}
              <div className="flex space-x-3 justify-end">
                <div className="flex-1 max-w-sm">
                  <div className="bg-blue-500 rounded-lg px-4 py-2">
                    <p className="text-sm text-white">
                      Hi. My name is Charlotte Crawley. I'm starting to log a ticket, please.
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">C</span>
                </div>
              </div>

              {/* AI Safety Question */}
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">AI</span>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                    <p className="text-sm text-gray-900 dark:text-white">
                      Is there any patient safety concern?
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer - No Safety Concern */}
              <div className="flex space-x-3 justify-end">
                <div className="flex-1 max-w-xs">
                  <div className="bg-blue-500 rounded-lg px-4 py-2">
                    <p className="text-sm text-white">
                      None.
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">C</span>
                </div>
              </div>

              {/* AI - System ID Request */}
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">AI</span>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                    <p className="text-sm text-gray-900 dark:text-white">
                      Can you give me the serial number or system ID of the device, or a case number if you have one?
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer - System ID */}
              <div className="flex space-x-3 justify-end">
                <div className="flex-1 max-w-sm">
                  <div className="bg-blue-500 rounded-lg px-4 py-2">
                    <p className="text-sm text-white">
                      Sure. The system ID is eight three one eight one seven six one one three three.
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">C</span>
                </div>
              </div>

              {/* AI - Device Identification */}
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">AI</span>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                    <p className="text-sm text-gray-900 dark:text-white">
                      I've identified a Revo CT scanner at St Vincent's Hospital Sydney. Is that the one you're calling about?
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer - Confirmation */}
              <div className="flex space-x-3 justify-end">
                <div className="flex-1 max-w-xs">
                  <div className="bg-blue-500 rounded-lg px-4 py-2">
                    <p className="text-sm text-white">
                      Yes. That's correct.
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">C</span>
                </div>
              </div>

              {/* AI - Existing Cases Check */}
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">AI</span>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                    <p className="text-sm text-gray-900 dark:text-white">
                      I can see 43 open cases on this device — including one about noise from the tube, another about an intermittent squeaking noise from the table, and another about an unrecognised tube installed on the system. Is this one of those?
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer - New Issue */}
              <div className="flex space-x-3 justify-end">
                <div className="flex-1 max-w-xs">
                  <div className="bg-blue-500 rounded-lg px-4 py-2">
                    <p className="text-sm text-white">
                      No. It's an entirely new issue.
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">C</span>
                </div>
              </div>

              {/* AI - Problem Description */}
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">AI</span>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                    <p className="text-sm text-gray-900 dark:text-white">
                      Tell me the problem with the device.
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer - Problem Description */}
              <div className="flex space-x-3 justify-end">
                <div className="flex-1 max-w-sm">
                  <div className="bg-blue-500 rounded-lg px-4 py-2">
                    <p className="text-sm text-white">
                      When scanning a patient, the protocol showed an error, and the scan couldn't complete. The error message said, "can't complete the scanning. Please contact support."
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">C</span>
                </div>
              </div>

              {/* Customer - System Down */}
              <div className="flex space-x-3 justify-end">
                <div className="flex-1 max-w-sm">
                  <div className="bg-blue-500 rounded-lg px-4 py-2">
                    <p className="text-sm text-white">
                      The system's down at the moment. I'd like to speak to a remote engineer, please.
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">C</span>
                </div>
              </div>

              {/* AI - Final Response */}
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">AI</span>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                    <p className="text-sm text-gray-900 dark:text-white">
                      I've run into a system issue while checking your details. Let me connect you to a remote engineer who can help with your CT scanner issue.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call Details Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center overflow-y-auto">
          <div
            className="fixed inset-0 h-full w-full bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          ></div>
          <div
            className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-gray-900 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute right-3 top-3 z-999 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.04289 16.5413C5.65237 16.9318 5.65237 17.565 6.04289 17.9555C6.43342 18.346 7.06658 18.346 7.45711 17.9555L11.9987 13.4139L16.5408 17.956C16.9313 18.3466 17.5645 18.3466 17.955 17.956C18.3455 17.5655 18.3455 16.9323 17.955 16.5418L13.4129 11.9997L17.955 7.4576C18.3455 7.06707 18.3455 6.43391 17.955 6.04338C17.5645 5.65286 16.9313 5.65286 16.5408 6.04338L11.9987 10.5855L7.45711 6.0439C7.06658 5.65338 6.43342 5.65338 6.04289 6.0439C5.65237 6.43442 5.65237 7.06759 6.04289 7.45811L10.5845 11.9997L6.04289 16.5413Z"
                  fill="currentColor"
                />
              </svg>
            </button>
            
            {selectedCall && (
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-t-2xl border-b border-purple-100 dark:border-purple-800">
                  <h3 className="text-xl font-bold text-black">
                    Call Details
                  </h3>
                </div>

                <div className="p-4 space-y-3">
                  {/* Basic Information - Compact Grid */}
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block font-medium text-black mb-1">
                        Customer
                      </label>
                      <div className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-2 rounded text-xs">
                        {selectedCall.customer}
                      </div>
                    </div>
                    <div>
                      <label className="block font-medium text-black mb-1">
                        Session ID
                      </label>
                      <div className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-2 rounded text-xs">
                        {selectedCall.sessionId}
                      </div>
                    </div>
                    <div>
                      <label className="block font-medium text-black mb-1">
                        Invoice #
                      </label>
                      <div className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-2 rounded text-xs">
                        {selectedCall.invoiceNumber}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block font-medium text-black mb-1">
                        Phone
                      </label>
                      <div className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-2 rounded text-xs">
                        {selectedCall.phone}
                      </div>
                    </div>
                    <div>
                      <label className="block font-medium text-black mb-1">
                        Status
                      </label>
                      <div className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-2 rounded text-xs flex">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedCall.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : selectedCall.status === 'Failed' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : selectedCall.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                          {selectedCall.status}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block font-medium text-black mb-1">
                        Disposition
                      </label>
                      <div className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-2 rounded text-xs">
                        {selectedCall.disposition}
                      </div>
                    </div>
                  </div>

                  {/* Recording Information - Compact */}
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">
                      Recording Info
                    </h4>
                    
                    <div className="space-y-2 text-xs">
                      <div className="grid grid-cols-1 gap-2">
                        <div>
                          <span className="font-medium text-black">Consent:</span>
                          <span className="ml-2 text-gray-900 dark:text-white">
                            {selectedCall.recordingConsent}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-black">Recording Ref:</span>
                          <span className="ml-2 text-gray-900 dark:text-white font-mono">
                            {selectedCall.recordingReference}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-black">Transcript Ref:</span>
                          <span className="ml-2 text-gray-900 dark:text-white font-mono">
                            {selectedCall.transcriptReference}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Compact Action Button */}
                  <div className="flex justify-end pt-3 border-t border-gray-200 dark:border-gray-600">
                    <button
                      onClick={closeModal}
                      className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}