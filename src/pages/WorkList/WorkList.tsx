import { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import DatePicker from "@/components/form/date-picker";
import Label from "@/components/form/Label";
import { CalenderIcon } from "@/icons";

export default function WorkList() {
  const [activeTab, setActiveTab] = useState("today");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [filters, setFilters] = useState({
    validation: "all",
    failureReason: "all", 
    callStatus: "all"
  });

  const tabs = [
    { id: "today", label: "Today" },
    { id: "archive", label: "Archive" }
  ];

  // Statistics data with appropriate colors
  const stats = [
    { value: "412", label: "Pre Validation", color: "border-t-blue-500" },
    { value: "318", label: "Validated", color: "border-t-green-500" },
    { value: "27", label: "Failed Validation", color: "border-t-red-500" },
    { value: "54", label: "Customers Called", color: "border-t-yellow-500" },
    { value: "301", label: "Calls Completed", color: "border-t-green-500" },
    { value: "9", label: "Critical exceptions", color: "border-t-red-500" }
  ];

  // Filter options

  // Sample table data with detailed invoice information
  const tableData = [
    {
      customer: "Univar Solutions B.V.",
      id: "180784",
      invoices: [
        { 
          number: "61635315", 
          description: "Invoice • due 09/25 • DPD 5", 
          amount: "NOK 75,420.25",
          outcome: "Passed",
          validation: "Passed",
          failureReason: "—"
        },
        { 
          number: "61635316", 
          description: "Invoice • due 09/28 • DPD 2", 
          amount: "NOK 72,438.50",
          outcome: "Failed",
          validation: "Failed", 
          failureReason: "Payment verification failed"
        }
      ],
      openAmount: "NOK 147,858.75",
      worklistScore: "76",
      contact: "ORDRE_NO@univarsolutions.com",
      phone: "+47 23 45 67 89",
      validation: "Passed",
      failureReason: "—",
      plannedTime: "09:40",
      callStatus: "Completed",
      eligibilityGates: {
        customer: { status: "failed", title: "Customer", subtitle: "A2 failed" },
        invoices: { status: "passed", title: "Invoices", subtitle: "1 of 1" },
        timing: { status: "passed", title: "Timing", subtitle: "Clear" }
      },
      date: "2026-09-25"
    },
    {
      customer: "Nordic Pharma AS",
      id: "359912",
      invoices: [
        { 
          number: "61635410", 
          description: "Invoice • due 09/30 • DPD 9", 
          amount: "NOK 22,140.00",
          outcome: "Blocked",
          validation: "Warning",
          failureReason: "Insufficient credit limit"
        }
      ],
      openAmount: "NOK 22,140.00",
      worklistScore: "92",
      contact: "ap.nordicpharma@nordicpharma.no",
      phone: "+47 22 98 76 54",
      validation: "Failed",
      failureReason: "Session creation failed after 3 attempts",
      plannedTime: "10:15",
      callStatus: "Blocked",
      eligibilityGates: {
        customer: { status: "passed", title: "Customer", subtitle: "A1 passed" },
        invoices: { status: "failed", title: "Invoices", subtitle: "0 of 2" },
        timing: { status: "passed", title: "Timing", subtitle: "Clear" }
      },
      date: "2026-09-24"
    },
    {
      customer: "Delta",
      id: "",
      invoices: [
        { 
          number: "61635488", 
          description: "Invoice • due 09/20 • DPD 15", 
          amount: "GBP 8,500.00",
          outcome: "Passed",
          validation: "Passed",
          failureReason: "—"
        },
        { 
          number: "61635489", 
          description: "Invoice • due 09/22 • DPD 13", 
          amount: "GBP 12,300.00",
          outcome: "Passed",
          validation: "Passed",
          failureReason: "—"
        }
      ],
      openAmount: "GBP 20,800.00",
      worklistScore: "58",
      contact: "finance@deltamedical.co.uk",
      phone: "+44 20 7123 4567",
      validation: "Failed",
      failureReason: "Missing",
      plannedTime: "11:05",
      callStatus: "Completed",
      eligibilityGates: {
        customer: { status: "passed", title: "Customer", subtitle: "B1 passed" },
        invoices: { status: "passed", title: "Invoices", subtitle: "3 of 3" },
        timing: { status: "failed", title: "Timing", subtitle: "Overdue" }
      },
      date: "2026-09-23"
    }
  ];

  // Filter options
  const filterOptions = {
    validation: ["all", ...Array.from(new Set(tableData.map(row => row.validation)))],
    failureReason: ["all", ...Array.from(new Set(tableData.map(row => row.failureReason).filter(reason => reason !== "—")))],
    callStatus: ["all", ...Array.from(new Set(tableData.map(row => row.callStatus)))]
  };

  // Filter table data based on search term and filters
  const filteredTableData = tableData.filter(row => {
    // Search filter
    const searchMatch = row.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.invoices.some(inv => 
        inv.number.toLowerCase().includes(searchTerm.toLowerCase()) || 
        inv.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.outcome.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      row.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.validation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.failureReason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.callStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.eligibilityGates.customer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.eligibilityGates.customer.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.eligibilityGates.invoices.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.eligibilityGates.invoices.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.eligibilityGates.timing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.eligibilityGates.timing.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Date range filter (only apply in Archive tab)
    let dateMatch = true;
    if (activeTab === "archive" && row.date) {
      const rowDate = new Date(row.date);
      const fromDate = dateRange.from ? new Date(dateRange.from) : null;
      const toDate = dateRange.to ? new Date(dateRange.to) : null;
      
      if (fromDate && toDate) {
        dateMatch = rowDate >= fromDate && rowDate <= toDate;
      } else if (fromDate) {
        dateMatch = rowDate >= fromDate;
      } else if (toDate) {
        dateMatch = rowDate <= toDate;
      }
    }
    
    // Dropdown filters
    const validationMatch = filters.validation === "all" || row.validation === filters.validation;
    const failureReasonMatch = filters.failureReason === "all" || row.failureReason === filters.failureReason;
    const callStatusMatch = filters.callStatus === "all" || row.callStatus === filters.callStatus;
    
    return searchMatch && dateMatch && validationMatch && failureReasonMatch && callStatusMatch;
  });

  // Handle filter changes
  const handleFilterChange = (filterType: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  // Debug function for date filtering
  const debugDateFilter = () => {
    if (activeTab === "archive") {
      console.log('Date Filter Debug:');
      console.log('dateRange:', dateRange);
      console.log('tableData dates:', tableData.map(row => ({ customer: row.customer, date: row.date })));
      
      const filtered = tableData.filter(row => {
        if (!row.date) return true;
        
        const rowDate = new Date(row.date);
        const fromDate = dateRange.from ? new Date(dateRange.from) : null;
        const toDate = dateRange.to ? new Date(dateRange.to) : null;
        
        console.log(`Row: ${row.customer}, Date: ${row.date}, RowDate: ${rowDate}, FromDate: ${fromDate}, ToDate: ${toDate}`);
        
        if (fromDate && toDate) {
          const match = rowDate >= fromDate && rowDate <= toDate;
          console.log(`Range match: ${match}`);
          return match;
        } else if (fromDate) {
          const match = rowDate >= fromDate;
          console.log(`From match: ${match}`);
          return match;
        } else if (toDate) {
          const match = rowDate <= toDate;
          console.log(`To match: ${match}`);
          return match;
        }
        return true;
      });
      
      console.log('Filtered results:', filtered.map(row => row.customer));
    }
  };

  // Accordion toggle function
  const toggleRowExpansion = (index: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(index)) {
      newExpandedRows.delete(index);
    } else {
      newExpandedRows.add(index);
    }
    setExpandedRows(newExpandedRows);
  };

  // Render accordion content
  const renderAccordionContent = (row: any) => (
    <tr>
      <td colSpan={9} className="py-0">
        <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden max-w-5xl">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600">
                    <th className="px-8 py-4 text-start text-sm font-medium text-gray-700 dark:text-gray-300 w-1/4">
                      Invoice
                    </th>
                    <th className="px-8 py-4 text-start text-sm font-medium text-gray-700 dark:text-gray-300 w-1/4">
                      Open amount
                    </th>
                    <th className="px-8 py-4 text-start text-sm font-medium text-gray-700 dark:text-gray-300 w-1/4">
                      Validation
                    </th>
                    <th className="px-8 py-4 text-start text-sm font-medium text-gray-700 dark:text-gray-300 w-1/4">
                      Failure Reason
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {row.invoices.map((invoice: any, idx: number) => (
                    <tr 
                      key={idx}
                      className="border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-8 py-4 w-1/4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {invoice.number}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {invoice.description}
                        </div>
                      </td>
                      <td className="px-8 py-4 text-sm font-medium text-gray-900 dark:text-white w-1/4">
                        {invoice.amount}
                      </td>
                      <td className="px-8 py-4 w-1/4">
                        <span className={getValidationBadge(invoice.validation)}>
                          {invoice.validation}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-sm text-gray-700 dark:text-gray-300 w-1/4">
                        {invoice.failureReason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );

  // Sort function
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Apply sorting to filtered data
  const sortedTableData = [...filteredTableData].sort((a, b) => {
    if (!sortField) return 0;
    
    let aVal, bVal;
    
    if (sortField === "worklistScore") {
      // Extract numeric value from string format
      aVal = parseInt(a.worklistScore);
      bVal = parseInt(b.worklistScore);
    } else {
      aVal = a[sortField as keyof typeof a];
      bVal = b[sortField as keyof typeof b];
    }
    
    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Render sort icon
  const renderSortIcon = (field: string) => {
    if (sortField !== field) {
      return (
        <svg className="w-5 h-5 ml-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    if (sortDirection === "asc") {
      return (
        <svg className="w-5 h-5 ml-2 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
        </svg>
      );
    } else {
      return (
        <svg className="w-5 h-5 ml-2 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
        </svg>
      );
    }
  };

  const getValidationBadge = (validation: string) => {
    const baseClasses = "px-3 py-2 rounded-full text-xs font-medium";
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
    const baseClasses = "px-3 py-2 rounded-full text-xs font-medium";
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

  const getOutcomeBadge = (outcome: string) => {
    const baseClasses = "px-3 py-2 rounded-full text-xs font-medium";
    switch (outcome) {
      case "Passed":
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
      case "Failed":
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
      case "Blocked":
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200`;
    }
  };

  const renderEligibilityGates = (gates: any) => {
    const getGateIcon = (status: string) => {
      if (status === "passed") {
        return (
          <svg className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      } else {
        return (
          <svg className="w-3 h-3 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      }
    };

    const getGateClasses = (status: string) => {
      const baseClasses = "flex items-start gap-1 px-1.5 py-1 rounded text-xs font-medium flex-1 min-w-0";
      if (status === "passed") {
        return `${baseClasses} bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700`;
      } else {
        return `${baseClasses} bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-700`;
      }
    };

    const renderGateContent = (gate: any) => (
      <div className="flex flex-col leading-tight min-w-0">
        <div className="font-medium truncate">{gate.title}</div>
        <div className="font-normal opacity-90 truncate">{gate.subtitle}</div>
      </div>
    );

    return (
      <div className="flex gap-1 w-full">
        <div className={getGateClasses(gates.customer.status)}>
          {getGateIcon(gates.customer.status)}
          {renderGateContent(gates.customer)}
        </div>
        <div className={getGateClasses(gates.invoices.status)}>
          {getGateIcon(gates.invoices.status)}
          {renderGateContent(gates.invoices)}
        </div>
        <div className={getGateClasses(gates.timing.status)}>
          {getGateIcon(gates.timing.status)}
          {renderGateContent(gates.timing)}
        </div>
      </div>
    );
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
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              {/* Validation Filter */}
              <div className="w-40">
                <Label htmlFor="validation-filter">Validation</Label>
                <div className="relative">
                  <select
                    id="validation-filter"
                    value={filters.validation}
                    onChange={(e) => handleFilterChange('validation', e.target.value)}
                    className={`h-11 w-full appearance-none rounded-lg border border-gray-300 bg-white dark:bg-gray-900 px-4 py-2.5 pr-10 text-sm shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none ${
                      filters.validation !== "all"
                        ? "text-gray-800 dark:text-white"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    <option value="all" className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">
                      All
                    </option>
                    {filterOptions.validation.slice(1).map(option => (
                      <option key={option} value={option} className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">
                        {option}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.79175 8.02075L10.0001 13.2291L15.2084 8.02075"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Failure Reason Filter */}
              <div className="w-48">
                <Label htmlFor="failure-reason-filter">Failure Reason</Label>
                <div className="relative">
                  <select
                    id="failure-reason-filter"
                    value={filters.failureReason}
                    onChange={(e) => handleFilterChange('failureReason', e.target.value)}
                    className={`h-11 w-full appearance-none rounded-lg border border-gray-300 bg-white dark:bg-gray-900 px-4 py-2.5 pr-10 text-sm shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none ${
                      filters.failureReason !== "all"
                        ? "text-gray-800 dark:text-white"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    <option value="all" className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">
                      All
                    </option>
                    {filterOptions.failureReason.slice(1).map(option => (
                      <option key={option} value={option} className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">
                        {option}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.79175 8.02075L10.0001 13.2291L15.2084 8.02075"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Call Status Filter */}
              <div className="w-40">
                <Label htmlFor="call-status-filter">Call Status</Label>
                <div className="relative">
                  <select
                    id="call-status-filter"
                    value={filters.callStatus}
                    onChange={(e) => handleFilterChange('callStatus', e.target.value)}
                    className={`h-11 w-full appearance-none rounded-lg border border-gray-300 bg-white dark:bg-gray-900 px-4 py-2.5 pr-10 text-sm shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none ${
                      filters.callStatus !== "all"
                        ? "text-gray-800 dark:text-white"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    <option value="all" className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">
                      All
                    </option>
                    {filterOptions.callStatus.slice(1).map(option => (
                      <option key={option} value={option} className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">
                        {option}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.79175 8.02075L10.0001 13.2291L15.2084 8.02075"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
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
                placeholder="Search customer, invoices, contact, phone"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-[320px]"
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
                    <th className="text-center py-3 px-2 font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                      <button
                        onClick={() => handleSort("worklistScore")}
                        className="flex items-center justify-center w-full hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                      >
                        <span className="text-center">
                          WORKLIST<br />SCORE
                        </span>
                        {renderSortIcon("worklistScore")}
                      </button>
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300 min-w-[180px]">
                      CUSTOMER
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300 min-w-[320px]">
                      ELIGIBILITY GATES
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                      OPEN AMOUNT
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
                      CALL STATUS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTableData.map((row, index) => (
                    <>
                      <tr 
                        key={index} 
                        className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => toggleRowExpansion(index)}
                      >
                        <td className="py-4 px-2 text-gray-700 dark:text-gray-300 min-w-[120px]">
                          <div className="flex items-center justify-between">
                            <svg 
                              className={`w-4 h-4 text-gray-400 transition-transform ${expandedRows.has(index) ? 'rotate-90' : ''}`} 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="font-medium text-center flex-1 -ms-4">
                              {row.worklistScore}
                            </span>
                            <div className="w-4"></div>
                          </div>
                        </td>
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
                        <td className="py-4 px-2 text-gray-700 dark:text-gray-300 min-w-[320px]">
                          {renderEligibilityGates(row.eligibilityGates)}
                        </td>
                        <td className="py-4 px-4 text-gray-700 dark:text-gray-300 min-w-[120px]">
                          {row.openAmount}
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

                        <td className="py-4 px-2 min-w-[100px]">
                          <span className={getCallStatusBadge(row.callStatus)}>
                            {row.callStatus}
                          </span>
                        </td>
                      </tr>
                      {expandedRows.has(index) && renderAccordionContent(row)}
                    </>
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
      {/* Archive Worklist Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            ARCHIVE WORKLIST
            {searchTerm && (
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                ({filteredTableData.length} results)
              </span>
            )}
            {(dateRange.from || dateRange.to) && (
              <span className="text-sm font-normal text-purple-600 dark:text-purple-400 ml-2">
                (Date filtered: {dateRange.from || 'Any'} → {dateRange.to || 'Any'})
              </span>
            )}
          </h2>
          
          {/* Filters and Search Rows */}
          <div className="space-y-4 mb-6">
            {/* First Row - Date Filters and Clear Button */}
            <div className="flex items-end gap-3">
              <div className="w-40">
                <DatePicker
                  id="archive-date-from"
                  label="From Date"
                  placeholder="Select start date"
                  className="w-full"
                  onChange={(dates, currentDateString) => {
                    setDateRange(prev => ({ ...prev, from: currentDateString }));
                  }}
                />
              </div>
              <div className="w-40">
                <DatePicker
                  id="archive-date-to"
                  label="To Date"
                  placeholder="Select end date"
                  className="w-full"
                  onChange={(dates, currentDateString) => {
                    setDateRange(prev => ({ ...prev, to: currentDateString }));
                  }}
                />
              </div>
              {(dateRange.from || dateRange.to) && (
                <button
                  onClick={() => setDateRange({ from: "", to: "" })}
                  className="h-11 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  title="Clear date range"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear
                </button>
              )}
            </div>

            {/* Second Row - Filters on Left, Search on Right */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              {/* Left Side - Filter Dropdowns */}
              <div className="flex flex-wrap gap-4">
                <div className="w-40">
                  <Label htmlFor="archive-validation-filter">Validation</Label>
                  <div className="relative">
                    <select
                      id="archive-validation-filter"
                      value={filters.validation}
                      onChange={(e) => handleFilterChange('validation', e.target.value)}
                      className={`h-11 w-full appearance-none rounded-lg border border-gray-300 bg-white dark:bg-gray-900 px-4 py-2.5 pr-10 text-sm shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none ${
                        filters.validation !== "all"
                          ? "text-gray-800 dark:text-white"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      <option value="all" className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">
                        All
                      </option>
                      {filterOptions.validation.slice(1).map(option => (
                        <option key={option} value={option} className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">
                          {option}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                      width="16"
                      height="16"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.79175 8.02075L10.0001 13.2291L15.2084 8.02075"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                <div className="w-48">
                  <Label htmlFor="archive-failure-reason-filter">Failure Reason</Label>
                  <div className="relative">
                    <select
                      id="archive-failure-reason-filter"
                      value={filters.failureReason}
                      onChange={(e) => handleFilterChange('failureReason', e.target.value)}
                      className={`h-11 w-full appearance-none rounded-lg border border-gray-300 bg-white dark:bg-gray-900 px-4 py-2.5 pr-10 text-sm shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none ${
                        filters.failureReason !== "all"
                          ? "text-gray-800 dark:text-white"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      <option value="all" className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">
                        All
                      </option>
                      {filterOptions.failureReason.slice(1).map(option => (
                        <option key={option} value={option} className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">
                          {option}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                      width="16"
                      height="16"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.79175 8.02075L10.0001 13.2291L15.2084 8.02075"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                <div className="w-40">
                  <Label htmlFor="archive-call-status-filter">Call Status</Label>
                  <div className="relative">
                    <select
                      id="archive-call-status-filter"
                      value={filters.callStatus}
                      onChange={(e) => handleFilterChange('callStatus', e.target.value)}
                      className={`h-11 w-full appearance-none rounded-lg border border-gray-300 bg-white dark:bg-gray-900 px-4 py-2.5 pr-10 text-sm shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none ${
                        filters.callStatus !== "all"
                          ? "text-gray-800 dark:text-white"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      <option value="all" className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">
                        All
                      </option>
                      {filterOptions.callStatus.slice(1).map(option => (
                        <option key={option} value={option} className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">
                          {option}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                      width="16"
                      height="16"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.79175 8.02075L10.0001 13.2291L15.2084 8.02075"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Right Side - Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search customer, invoices, contact, phone"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-w-[320px]"
                />
              </div>
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
                    <th className="text-center py-3 px-2 font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                      <button
                        onClick={() => handleSort("worklistScore")}
                        className="flex items-center justify-center w-full hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                      >
                        <span className="text-center">
                          WORKLIST<br />SCORE
                        </span>
                        {renderSortIcon("worklistScore")}
                      </button>
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300 min-w-[180px]">
                      CUSTOMER
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300 min-w-[320px]">
                      ELIGIBILITY GATES
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">
                      OPEN AMOUNT
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
                      CALL STATUS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTableData.map((row, index) => (
                    <>
                      <tr 
                        key={index} 
                        className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => toggleRowExpansion(index)}
                      >
                        <td className="py-4 px-2 text-gray-700 dark:text-gray-300 min-w-[120px]">
                          <div className="flex items-center justify-between">
                            <svg 
                              className={`w-4 h-4 text-gray-400 transition-transform ${expandedRows.has(index) ? 'rotate-90' : ''}`} 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="font-medium text-center flex-1 -ms-4">
                              {row.worklistScore}
                            </span>
                            <div className="w-4"></div>
                          </div>
                        </td>
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
                        <td className="py-4 px-2 text-gray-700 dark:text-gray-300 min-w-[320px]">
                          {renderEligibilityGates(row.eligibilityGates)}
                        </td>
                        <td className="py-4 px-4 text-gray-700 dark:text-gray-300 min-w-[120px]">
                          {row.openAmount}
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

                        <td className="py-4 px-2 min-w-[100px]">
                          <span className={getCallStatusBadge(row.callStatus)}>
                            {row.callStatus}
                          </span>
                        </td>
                      </tr>
                      {expandedRows.has(index) && renderAccordionContent(row)}
                    </>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
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
          Today's Operation 
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Friday, Sep 25 2026 · updated 2 min ago
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
                  py-2 px-1 border-b-2 font-bold text-sm transition-colors duration-200
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