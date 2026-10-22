import { useState } from "react";
import PageMeta from "@/components/common/PageMeta";
import Overview from "./Overview";
import ExtractedData from "./ExtractedData";
import Trace from "./Trace";
import RawEvents from "./RawEvents";

export default function Calls() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", component: Overview },
    { id: "extractedData", label: "Extracted Data", component: ExtractedData },
    { id: "trace", label: "Trace", component: Trace },
    { id: "rawEvents", label: "Raw Events", component: RawEvents }
  ];

  const renderTabContent = () => {
    const activeTabConfig = tabs.find(tab => tab.id === activeTab);
    if (activeTabConfig) {
      const Component = activeTabConfig.component;
      return <Component />;
    }
    return null;
  };

  return (
    <>
      <PageMeta
        title="Calls Dashboard | TailAdmin - Collections Dashboard"
        description="Calls management dashboard for collections operations"
      />
      
      <div className="mb-3">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Calls
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Call management and tracking
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