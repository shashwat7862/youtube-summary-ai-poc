import { useCallback, useState } from "react";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || window.location.origin
).replace(/\/$/, "");

export interface AskQuestionResponse {
  question: string;
  answer: string;
  source: unknown[];
}

interface ApiErrorResponse {
  message?: string;
  detail?: string;
}

class ChatbotApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ChatbotApiError";
    this.status = status;
  }
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object";

const isAskQuestionResponse = (
  value: unknown,
): value is AskQuestionResponse =>
  isObject(value) &&
  typeof value.question === "string" &&
  typeof value.answer === "string" &&
  Array.isArray(value.source);

const getErrorMessage = async (response: Response): Promise<string> => {
  try {
    const body = (await response.json()) as ApiErrorResponse;
    if (body.message) {
      return body.message;
    }
    if (body.detail) {
      return body.detail;
    }
  } catch {
    // The API may return an empty or non-JSON error response.
  }

  return `Request failed with status ${response.status}`;
};

class ChatbotApiService {
  async askQuestion(question: string): Promise<AskQuestionResponse> {
    let response: Response;

    try {
      response = await fetch(`${API_BASE_URL}/youtube/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ question, top_k: 4 }),
      });
    } catch (error) {
      throw new ChatbotApiError(
        error instanceof Error
          ? error.message
          : "Unable to connect to the chatbot service",
      );
    }

    if (!response.ok) {
      throw new ChatbotApiError(
        await getErrorMessage(response),
        response.status,
      );
    }

    let data: unknown;

    try {
      data = await response.json();
    } catch {
      throw new ChatbotApiError("The chatbot service returned invalid JSON");
    }

    if (!isAskQuestionResponse(data)) {
      throw new ChatbotApiError("The chatbot service returned an invalid response");
    }

    return data;
  }
}

export const chatbotApi = new ChatbotApiService();

export function useChatbotApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const askQuestion = useCallback(async (question: string) => {
    setLoading(true);
    setError(null);

    try {
      return await chatbotApi.askQuestion(question);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to get an answer",
      );
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    askQuestion,
  };
}
