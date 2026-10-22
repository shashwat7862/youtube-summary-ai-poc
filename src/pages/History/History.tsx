import { useEffect, useMemo, useState } from "react";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import {
  VideoIcon,
  SearchIcon,
  FileIcon,
  TextIcon,
  CopyIcon,
} from "@/icons";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import {
  useVideoSummariesApi,
  type VideoSummaryHistoryItem,
} from "@/services/videoSummaryApi";

const PAGE_SIZE = 10;

export default function History() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] =
    useState<VideoSummaryHistoryItem | null>(null);
  const transcriptModal = useModal();
  const summaryModal = useModal();
  const {
    loading,
    error,
    data: historyData,
    loadSummaries,
  } = useVideoSummariesApi();

  useEffect(() => {
    void loadSummaries().catch(() => undefined);
  }, [loadSummaries]);

  const filteredHistory = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return historyData ?? [];
    }

    return (historyData ?? []).filter((item) =>
      [
        item.title,
        item.videoLink,
        item.transcribeText,
        item.summaryText,
      ].some((value) => value.toLowerCase().includes(normalizedSearch)),
    );
  }, [historyData, searchTerm]);

  const totalPages = Math.ceil(filteredHistory.length / PAGE_SIZE);
  const activePage = Math.min(currentPage, Math.max(totalPages, 1));
  const startIndex = (activePage - 1) * PAGE_SIZE;
  const paginatedHistory = filteredHistory.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleTranscript = (item: VideoSummaryHistoryItem) => {
    setSelectedItem(item);
    transcriptModal.openModal();
  };

  const handleSummary = (item: VideoSummaryHistoryItem) => {
    setSelectedItem(item);
    summaryModal.openModal();
  };

  const copyToClipboard = (text: string) => {
    void navigator.clipboard.writeText(text);
  };

  const retryLoad = () => {
    void loadSummaries().catch(() => undefined);
  };

  return (
    <>
      <PageMeta
        title="History | Video Summerizer"
        description="View and manage your video summary history"
      />

      <div className="mx-auto w-full max-w-[1200px]">
        <PageBreadcrumb pageTitle="History" />

        <div className="grid grid-cols-1 gap-6">
          <ComponentCard title="Summary History">
            <div className="space-y-6">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                  <SearchIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="search"
                  className="block w-full rounded-lg border border-gray-300 bg-white p-3 ps-10 text-sm text-gray-900 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-brand-500 dark:focus:ring-brand-500"
                  placeholder="Search videos by title or content..."
                  value={searchTerm}
                  onChange={(event) => handleSearchChange(event.target.value)}
                />
              </div>

              {loading && (
                <div
                  className="flex items-center justify-center gap-3 py-12 text-sm text-gray-600 dark:text-gray-300"
                  role="status"
                  aria-live="polite"
                >
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-brand-500 dark:border-gray-700 dark:border-t-brand-400" />
                  Loading video history...
                </div>
              )}

              {!loading && error && (
                <div
                  className="rounded-lg border border-error-200 bg-error-50 p-4 dark:border-error-800 dark:bg-error-900/20"
                  role="alert"
                >
                  <p className="text-sm font-medium text-error-800 dark:text-error-200">
                    Error loading video history
                  </p>
                  <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                    {error}
                  </p>
                  <button
                    type="button"
                    onClick={retryLoad}
                    className="mt-3 rounded-lg bg-error-600 px-3 py-2 text-sm font-medium text-white hover:bg-error-700 focus:outline-none focus:ring-2 focus:ring-error-500 dark:bg-error-500 dark:hover:bg-error-600"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {!loading && !error && historyData && (
                <>
                  {paginatedHistory.length > 0 ? (
                    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                              <th className="px-6 py-3 text-start text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                Video Details
                              </th>
                              <th className="px-6 py-3 text-start text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                Transcript
                              </th>
                              <th className="px-6 py-3 text-start text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                Summary
                              </th>
                              <th className="px-6 py-3 text-start text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                            {paginatedHistory.map((item, index) => (
                              <tr
                                key={`${item.videoLink}-${startIndex + index}`}
                                className="hover:bg-gray-50 dark:hover:bg-gray-800"
                              >
                                <td className="px-6 py-4">
                                  <div className="flex min-w-72 items-start gap-3">
                                    {item.thumbnail ? (
                                      <img
                                        src={item.thumbnail}
                                        alt={item.title}
                                        className="h-14 w-24 shrink-0 rounded-lg object-cover"
                                      />
                                    ) : (
                                      <div className="flex h-14 w-24 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                                        <VideoIcon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                                      </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {item.title}
                                      </p>
                                      <a
                                        href={item.videoLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mt-1 block max-w-xs truncate text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                                      >
                                        {item.videoLink}
                                      </a>
                                    </div>
                                  </div>
                                </td>
                                <td className="max-w-xs px-6 py-4">
                                  <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                                    {item.transcribeText}
                                  </p>
                                </td>
                                <td className="max-w-xs px-6 py-4">
                                  <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                                    {item.summaryText}
                                  </p>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                  <div className="flex gap-2">
                                    <button
                                      type="button"
                                      onClick={() => handleTranscript(item)}
                                      className="inline-flex items-center rounded-md bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-800 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                                    >
                                      <FileIcon className="me-1 h-3 w-3" />
                                      Transcript
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleSummary(item)}
                                      className="inline-flex items-center rounded-md bg-success-100 px-3 py-1.5 text-xs font-medium text-success-800 hover:bg-success-200 focus:outline-none focus:ring-2 focus:ring-success-500 dark:bg-success-900 dark:text-success-300 dark:hover:bg-success-800"
                                    >
                                      <TextIcon className="me-1 h-3 w-3" />
                                      Summary
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <VideoIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                        No videos found
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {searchTerm
                          ? "Try adjusting your search criteria."
                          : "Your video summary history is empty."}
                      </p>
                    </div>
                  )}

                  {filteredHistory.length > 0 && (
                    <div className="flex flex-col gap-4 border-t border-gray-200 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-700">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Showing {startIndex + 1} to{" "}
                        {Math.min(startIndex + PAGE_SIZE, filteredHistory.length)} of{" "}
                        {filteredHistory.length} videos
                        {filteredHistory.length !== historyData.length &&
                          ` (filtered from ${historyData.length})`}
                      </p>

                      {totalPages > 1 && (
                        <nav
                          className="flex flex-wrap items-center gap-2"
                          aria-label="History pagination"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setCurrentPage(Math.max(1, activePage - 1))
                            }
                            disabled={activePage === 1}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            Previous
                          </button>

                          {Array.from(
                            { length: totalPages },
                            (_, index) => index + 1,
                          ).map((page) => (
                            <button
                              key={page}
                              type="button"
                              onClick={() => setCurrentPage(page)}
                              aria-current={page === activePage ? "page" : undefined}
                              className={`h-9 min-w-9 rounded-lg px-3 text-sm font-medium ${
                                page === activePage
                                  ? "bg-brand-600 text-white dark:bg-brand-500"
                                  : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                              }`}
                            >
                              {page}
                            </button>
                          ))}

                          <button
                            type="button"
                            onClick={() =>
                              setCurrentPage(
                                Math.min(totalPages, activePage + 1),
                              )
                            }
                            disabled={activePage === totalPages}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            Next
                          </button>
                        </nav>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </ComponentCard>
        </div>
      </div>

      <Modal
        isOpen={transcriptModal.isOpen}
        onClose={transcriptModal.closeModal}
        className="max-w-4xl"
      >
        <div className="p-6">
          <div className="flex items-start gap-3">
            <FileIcon className="h-6 w-6 shrink-0 text-blue-600 dark:text-blue-400" />
            <div className="w-full min-w-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                Video Transcript
              </h3>
              {selectedItem && (
                <>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {selectedItem.title}
                  </p>
                  <div className="mt-6 max-h-96 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4 custom-scrollbar dark:border-gray-600 dark:bg-gray-700">
                    <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                      {selectedItem.transcribeText}
                    </pre>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(selectedItem.transcribeText)
                      }
                      className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-theme-xs hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                      <CopyIcon className="me-2 h-4 w-4" />
                      Copy Transcript
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={summaryModal.isOpen}
        onClose={summaryModal.closeModal}
        className="max-w-4xl"
      >
        <div className="p-6">
          <div className="flex items-start gap-3">
            <TextIcon className="h-6 w-6 shrink-0 text-success-600 dark:text-success-400" />
            <div className="w-full min-w-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                AI Generated Summary
              </h3>
              {selectedItem && (
                <>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {selectedItem.title}
                  </p>
                  <div className="mt-6 max-h-96 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4 custom-scrollbar dark:border-gray-600 dark:bg-gray-700">
                    <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                      {selectedItem.summaryText}
                    </p>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(selectedItem.summaryText)}
                      className="inline-flex items-center justify-center rounded-md bg-success-600 px-4 py-2 text-sm font-medium text-white shadow-theme-xs hover:bg-success-700 focus:outline-none focus:ring-2 focus:ring-success-500 dark:bg-success-500 dark:hover:bg-success-600"
                    >
                      <CopyIcon className="me-2 h-4 w-4" />
                      Copy Summary
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
