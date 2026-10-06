import PageMeta from "@/components/common/PageMeta";

export default function Calls() {
  return (
    <>
      <PageMeta
        title="Calls Dashboard | TailAdmin - Collections Dashboard"
        description="Calls management dashboard for collections operations"
      />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Calls
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Call management and tracking
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <h2 className="text-lg font-semibold mb-2">Calls Management</h2>
          <p>Call tracking and management functionality will be implemented here.</p>
          <p className="text-sm mt-2">This page is ready for call operations, history, and analytics.</p>
        </div>
      </div>
    </>
  );
}