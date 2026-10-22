import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import PageMeta from "@/components/common/PageMeta";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { BrainIcon, UserIcon, ClockIcon, PaperPlaneIcon } from "@/icons";
import { useChatbotApi } from "@/services/chatbotApi";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  sources?: unknown[];
}

const initialMessages: Message[] = [
  {
    id: "welcome",
    type: "bot",
    content:
      "Hello! I'm your AI assistant for video summarization. Ask me a question about your processed videos.",
    timestamp: new Date(),
  },
];

let messageSequence = 0;

const createMessageId = () => `${Date.now()}-${messageSequence++}`;

const formatSource = (source: unknown): string => {
  if (typeof source === "string") {
    return source;
  }

  if (
    source === null ||
    typeof source === "number" ||
    typeof source === "boolean" ||
    typeof source === "undefined"
  ) {
    return String(source);
  }

  try {
    return JSON.stringify(source, null, 2);
  } catch {
    return String(source);
  }
};

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { loading: isTyping, error, askQuestion } = useChatbotApi();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isTyping, messages]);

  const handleSendMessage = async () => {
    const question = inputMessage.trim();

    if (!question || isTyping) {
      return;
    }

    const userMessage: Message = {
      id: createMessageId(),
      type: "user",
      content: question,
      timestamp: new Date(),
    };

    setMessages((previousMessages) => [...previousMessages, userMessage]);
    setInputMessage("");

    try {
      const response = await askQuestion(question);
      const botMessage: Message = {
        id: createMessageId(),
        type: "bot",
        content: response.answer,
        timestamp: new Date(),
        sources: response.source,
      };

      setMessages((previousMessages) => [...previousMessages, botMessage]);
    } catch {
      // The hook exposes the API error. Do not append fallback chat content.
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSendMessage();
    }
  };

  const formatTimestamp = (date: Date) =>
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <>
      <PageMeta
        title="AI Chatbot | Video Summerizer"
        description="Chat with AI assistant about your video summaries and get instant help"
      />

      <div className="mx-auto w-full max-w-[1080px]">
        <PageBreadcrumb pageTitle="AI Chatbot" />

        <div className="grid grid-cols-1">
          <ComponentCard title="Live Chat Assistant">
            <div className="flex h-[calc(100vh-280px)] flex-col">
              <div className="flex shrink-0 items-center gap-3 border-b border-gray-200 pb-4 dark:border-gray-700">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white dark:from-brand-500 dark:to-brand-700">
                  <BrainIcon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    AI Assistant
                  </h4>
                  <p className="flex items-center gap-1 text-sm text-success-600 dark:text-success-400">
                    <span className="h-2 w-2 rounded-full bg-success-500 dark:bg-success-400" />
                    Online
                  </p>
                </div>
              </div>

              <div className="custom-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto py-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.type === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex max-w-[80%] gap-3 ${
                        message.type === "user" ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <div className="shrink-0">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            message.type === "user"
                              ? "bg-brand-500 text-white dark:bg-brand-500"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {message.type === "user" ? (
                            <UserIcon className="h-4 w-4" />
                          ) : (
                            <BrainIcon className="h-4 w-4" />
                          )}
                        </div>
                      </div>

                      <div
                        className={`flex min-w-0 flex-col gap-1 ${
                          message.type === "user" ? "items-end" : "items-start"
                        }`}
                      >
                        <div
                          className={`rounded-2xl px-4 py-3 text-sm ${
                            message.type === "user"
                              ? "rounded-ee-lg bg-brand-500 text-white dark:bg-brand-500"
                              : "rounded-es-lg bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
                          }`}
                        >
                          <div className="whitespace-pre-wrap break-words leading-relaxed">
                            {message.content}
                          </div>

                          {message.type === "bot" &&
                            message.sources &&
                            message.sources.length > 0 && (
                              <div className="mt-3 border-t border-gray-200 pt-3 dark:border-gray-600">
                                <p className="mb-2 text-xs font-semibold text-gray-700 dark:text-gray-200">
                                  Sources
                                </p>
                                <ol className="space-y-2 ps-4 text-xs text-gray-600 dark:text-gray-300">
                                  {message.sources.map((source, index) => (
                                    <li
                                      key={`${message.id}-source-${index}`}
                                      className="list-decimal"
                                    >
                                      <pre className="whitespace-pre-wrap break-words font-sans">
                                        {formatSource(source)}
                                      </pre>
                                    </li>
                                  ))}
                                </ol>
                              </div>
                            )}
                        </div>

                        <div
                          className={`flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 ${
                            message.type === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <ClockIcon className="h-3 w-3" />
                          {formatTimestamp(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start" role="status">
                    <div className="flex max-w-[80%] gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                        <BrainIcon className="h-4 w-4" />
                      </div>
                      <div className="rounded-2xl rounded-es-lg bg-gray-100 px-4 py-3 text-sm dark:bg-gray-700">
                        <div className="flex gap-1">
                          <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s] dark:bg-gray-500" />
                          <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s] dark:bg-gray-500" />
                          <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="shrink-0 border-t border-gray-200 pt-4 dark:border-gray-700">
                {error && (
                  <div
                    className="mb-3 rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700 dark:border-error-800 dark:bg-error-900/20 dark:text-error-300"
                    role="alert"
                  >
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <div className="flex-1">
                    <textarea
                      className="w-full resize-none rounded-xl border border-gray-300 bg-white p-3 text-sm text-gray-900 focus:border-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-brand-500 dark:focus:ring-brand-500"
                      rows={1}
                      placeholder="Type your message here..."
                      value={inputMessage}
                      onChange={(event) => setInputMessage(event.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={isTyping}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleSendMessage()}
                    disabled={!inputMessage.trim() || isTyping}
                    aria-label="Send message"
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white shadow-theme-xs transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-brand-500 dark:hover:bg-brand-600"
                  >
                    <PaperPlaneIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </ComponentCard>
        </div>
      </div>
    </>
  );
}
